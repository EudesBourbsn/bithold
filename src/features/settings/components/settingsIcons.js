const outlineIcon = content =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${content}</svg>`;

export const settingsIcons = {
  passcode: outlineIcon(
    '<rect x="4" y="2.5" width="16" height="19" rx="4"/><path d="M8 6.5h8"/><g fill="#FFFFFF" stroke="none"><circle cx="8" cy="11" r="1"/><circle cx="12" cy="11" r="1"/><circle cx="16" cy="11" r="1"/><circle cx="8" cy="15" r="1"/><circle cx="12" cy="15" r="1"/><circle cx="16" cy="15" r="1"/></g><path d="M11 18.5h2"/>',
  ),
  face_id: outlineIcon(
    '<path d="M7 3H5a2 2 0 0 0-2 2v2m14-4h2a2 2 0 0 1 2 2v2M3 17v2a2 2 0 0 0 2 2h2m14-4v2a2 2 0 0 1-2 2h-2"/><circle cx="12" cy="9" r="3"/><path d="M6.5 18v-1a4 4 0 0 1 4-4h3a4 4 0 0 1 4 4v1"/>',
  ),
  currency: outlineIcon(
    '<circle cx="9" cy="9" r="6"/><path d="M15 8a6.5 6.5 0 1 1-7 7"/><path d="M10.5 6.5h-2a1.25 1.25 0 0 0 0 2.5h1a1.25 1.25 0 0 1 0 2.5h-2M9 5.5v1m0 5v1M16 12v6m-2-3h4"/>',
  ),
  bitcoin_unit: outlineIcon(
    '<path d="M12 2.5v3M6.5 8h11m-11 4h11m-11 4h11M12 18.5v3"/>',
  ),
  language: outlineIcon(
    '<path d="M3 5h11M8.5 3v2m3.5 0c-1 5-4 8-8 10m1.5-7c1 3 3.5 5 6.5 6M13 21l4-10 4 10m-6.8-3h5.6"/>',
  ),
  notifications: outlineIcon(
    '<path d="M13 4H6a3 3 0 0 0-3 3v13l4-3h11a3 3 0 0 0 3-3v-3M7 8h5m-5 4h10"/><circle cx="18" cy="5" r="3" fill="#FFFFFF" stroke="none"/>',
  ),
  sounds: outlineIcon(
    '<path d="M3 10v4M7.5 6v12M12 3v18m4.5-15v12M21 10v4"/>',
  ),
  haptic: outlineIcon(
    '<circle cx="12" cy="12" r="2.5"/><path d="M7.5 7.5a6.36 6.36 0 0 0 0 9m9-9a6.36 6.36 0 0 1 0 9M4.5 4.5a10.6 10.6 0 0 0 0 15m15-15a10.6 10.6 0 0 1 0 15"/>',
  ),
  portfolio_animation: outlineIcon(
    '<path d="m10 4 2.3 5.7L18 12l-5.7 2.3L10 20l-2.3-5.7L2 12l5.7-2.3L10 4ZM19 2v5m-2.5-2.5h5M19 17v5m-2.5-2.5h5"/>',
  ),
  block_explorer: outlineIcon(
    '<path d="m12 2 9 5v10l-9 5-9-5V7l9-5Zm-9 5 9 5 9-5M12 12v10M7.5 4.5l9 5v5"/>',
  ),
  reset_wallet: outlineIcon(
    '<path d="M3 10a9 9 0 1 1 1.5 7M3 4v6h6M9 14h6"/>',
  ),
  balance_lighting:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"><path d="M4 4l16 16M10 3l11 11M3 10l11 11M16 3l5 5M3 16l5 5"/></svg>\n',
  backup:
    '<svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="m8.97 13.25 6.062-3.5M8.97 9.75l6.062 3.5M12.001 8v7" stroke="#fff" stroke-opacity="1"></path><path d="M2 10.493c0 5.409 3.232 10.25 8.109 12.145l.035.013a5.109 5.109 0 0 0 3.713 0l.028-.012C18.766 20.74 22 15.892 22 10.477V5.926c0-1.07-.669-2.015-1.651-2.333L12.7 1.11a2.269 2.269 0 0 0-1.402 0L3.65 3.592C2.67 3.912 2 4.856 2 5.926v4.567Z" clip-rule="evenodd" stroke="#fff" stroke-opacity="1"></path></g></svg>\n',
  backup_shield:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="square"><path d="M4 6 12 2.5 20 6v7a8 8 0 0 1-16 0V6Z"/><path d="m9 12 2 2 4-4"/></svg>\n',
  backup_key:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="square"><path d="M15.5 14a5.5 5.5 0 1 0-5.3365-4.16351L4 16v4h4l2-2v-2.5h2.5l1.6635-1.6635A5.5 5.5 0 0 0 15.5 14Z"/><circle cx="15.5" cy="8.5" r=".5"/></svg>\n',
  chevron_right:
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 15.9999L13.2929 12.707C13.6834 12.3165 13.6834 11.6833 13.2929 11.2928L10 7.99994" stroke="white" stroke-width="2" stroke-opacity="1" stroke-linecap="round" stroke-linejoin="round"></path></svg>\n',
};
