export class SheetPresentationLifecycle {
  constructor(callbacks) {
    this.callbacks = callbacks;
    this.phase = 'hidden';
    this.generation = 0;
    this.controlledVisible = false;
    this.requestKey = 0;
    this.wanted = false;
    this.notifyClose = false;
    this.disposed = false;
  }
  publish(modalVisible, mounted) {
    this.callbacks.update({
      modalVisible,
      mounted,
      generation: this.generation,
    });
  }
  open() {
    if (this.disposed || this.phase !== 'hidden') {
      return;
    }
    this.generation += 1;
    this.presentationRequestKey = this.requestKey;
    this.phase = 'opening';
    this.notifyClose = false;
    this.nativeReady = false;
    this.sheetIsReady = false;
    this.openCommanded = false;
    this.closeCommanded = false;
    this.hasOpened = false;
    this.frameHidden = false;
    this.closeOrigin = null;
    this.callbacks.closing(false);
    this.publish(true, true);
  }
  setVisible(visible, requestKey = 0) {
    if (
      this.disposed ||
      (visible === this.controlledVisible && requestKey === this.requestKey)
    ) {
      return;
    }
    this.controlledVisible = visible;
    this.requestKey = requestKey;
    this.wanted = visible;
    if (visible) {
      if (this.phase === 'hidden') {
        this.open();
      } else if (this.phase === 'opening' || this.phase === 'open') {
        this.presentationRequestKey = requestKey;
      }
    } else {
      this.notifyClose = false;
      if (this.phase === 'opening' || this.phase === 'open') {
        this.beginClose(false, true, 'external');
      } else if (this.phase === 'closing' && this.closeOrigin === 'gesture') {
        this.closeOrigin = 'external';
        this.callbacks.closing(true, 'external');
        this.advance();
      }
    }
  }
  beginClose(notify, animate, origin = 'user') {
    if (this.disposed || (this.phase !== 'opening' && this.phase !== 'open')) {
      return;
    }
    this.wanted = false;
    this.notifyClose = notify;
    this.phase = 'closing';
    this.closeOrigin = origin;
    this.callbacks.closing(true, origin);
    if (animate) {
      this.advance();
    }
  }
  dismiss() {
    this.beginClose(this.controlledVisible, true);
  }
  animationClosing(generation) {
    if (
      generation !== this.generation ||
      this.disposed ||
      !this.openCommanded
    ) {
      return;
    }
    this.beginClose(this.controlledVisible, false, 'gesture');
  }
  animationOpening(generation) {
    if (
      generation !== this.generation ||
      this.disposed ||
      this.phase !== 'closing' ||
      this.closeOrigin !== 'gesture' ||
      !this.controlledVisible
    ) {
      return;
    }

    this.phase = this.hasOpened ? 'open' : 'opening';
    this.wanted = true;
    this.notifyClose = false;
    this.closeOrigin = null;
    this.frameHidden = false;
    this.closeCommanded = false;
    this.callbacks.closing(false);
  }
  nativeShown(generation) {
    if (generation !== this.generation || this.disposed) {
      return;
    }
    this.nativeReady = true;
    this.advance();
  }
  sheetReady(generation) {
    if (generation !== this.generation || this.disposed) {
      return;
    }
    this.sheetIsReady = true;
    this.advance();
  }
  sheetOpened(generation) {
    if (
      generation !== this.generation ||
      this.disposed ||
      !this.openCommanded ||
      !this.nativeReady ||
      !this.sheetIsReady
    ) {
      return;
    }
    this.hasOpened = true;
    if (this.phase === 'opening') {
      this.phase = 'open';
    }
  }
  advance() {
    if (this.disposed || !this.nativeReady || !this.sheetIsReady) {
      return;
    }
    if (this.phase === 'opening' && !this.openCommanded) {
      this.openCommanded = true;
      this.callbacks.openSheet();
    } else if (this.phase === 'closing') {
      if (this.frameHidden || !this.openCommanded) {
        this.requestNativeDismiss();
      } else if (this.closeOrigin !== 'gesture' && !this.closeCommanded) {
        this.closeCommanded = true;
        this.callbacks.closeSheet();
      }
    }
  }
  sheetHidden(generation) {
    if (
      generation !== this.generation ||
      this.disposed ||
      this.phase !== 'closing'
    ) {
      return;
    }
    this.frameHidden = true;
    this.advance();
  }
  requestNativeDismiss() {
    this.phase = 'dismissing';
    this.callbacks.closing(false);

    this.publish(false, true);
  }
  nativeDismissed(generation) {
    if (
      generation !== this.generation ||
      this.disposed ||
      this.phase !== 'dismissing'
    ) {
      return;
    }
    const notify = this.notifyClose && !this.wanted;
    const requestKey = this.presentationRequestKey;
    this.phase = 'hidden';
    this.notifyClose = false;
    this.publish(false, false);

    if (notify) {
      this.callbacks.onClose(requestKey);
    }
    this.callbacks.onDismiss();
    if (this.wanted) {
      this.open();
    }
  }
  attach() {
    this.disposed = false;
  }
  dispose() {
    this.disposed = true;
  }
}
