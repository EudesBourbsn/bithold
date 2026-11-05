import React from 'react';
import { Text } from 'react-native';

// Renders a translated sentence whose placeholders are nested elements, so
// each language can put a link where its grammar needs it:
// <TemplateText text="Read {link}." slots={{ link: <Text>this guide</Text> }} />
export function TemplateText({ text, slots, ...props }) {
  const parts = text.split(/\{(\w+)\}/);
  return (
    <Text {...props}>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <React.Fragment key={index}>
            {slots[part] ?? `{${part}}`}
          </React.Fragment>
        ) : (
          part
        ),
      )}
    </Text>
  );
}
