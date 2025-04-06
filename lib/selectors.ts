export const selectors = [
    // Input validation styling
    {
      name: 'Validation Styles',
      open: false,
      buildProps: ['border-color', 'color'],
      properties: [
        {
          name: 'Error Border Color',
          property: 'border-color',
          type: 'color',
          defaults: '#ff4d4d',
        },
        {
          name: 'Error Text Color',
          property: 'color',
          type: 'color',
          defaults: '#ff4d4d',
        },
      ],
    },                                        
    {
      // Define the "Layout" sector for display types and positioning
      name: 'Layout',
      open: true,
      buildProps: ['display', 'position', 'top', 'right', 'bottom', 'left'],
      properties: [
        {
          name: 'Display',
          property: 'display',
          type: 'select',
          options: [
            { value: 'block', name: 'Block' },
            { value: 'inline-block', name: 'Inline Block' },
            { value: 'flex', name: 'Flex' },
            { value: 'grid', name: 'Grid' },
            { value: 'none', name: 'None' },
          ],
          defaults: 'block',
        },
        {
          name: 'Position',
          property: 'position',
          type: 'select',
          options: [
            { value: 'static', name: 'Static' },
            { value: 'relative', name: 'Relative' },
            { value: 'absolute', name: 'Absolute' },
            { value: 'fixed', name: 'Fixed' },
            { value: 'sticky', name: 'Sticky' },
          ],
          defaults: 'static',
        },
        {
          name: 'Top',
          property: 'top',
          type: 'integer',
          units: ['px', '%', 'vh'],
          defaults: '',
        },
        {
          name: 'Right',
          property: 'right',
          type: 'integer',
          units: ['px', '%', 'vh'],
          defaults: '',
        },
        {
          name: 'Bottom',
          property: 'bottom',
          type: 'integer',
          units: ['px', '%', 'vh'],
          defaults: '',
        },
        {
          name: 'Left',
          property: 'left',
          type: 'integer',
          units: ['px', '%', 'vh'],
          defaults: '',
        },
      ],
    },
    {
      // Define the "Flex" sector for flexbox properties
      name: 'Flexbox',
      open: false,
      buildProps: ['flex-direction', 'align-items', 'justify-content', 'flex-wrap', 'align-content'],
      properties: [
        {
          name: 'Direction',
          property: 'flex-direction',
          type: 'select',
          options: [
            { value: 'row', name: 'Row' },
            { value: 'row-reverse', name: 'Row Reverse' },
            { value: 'column', name: 'Column' },
            { value: 'column-reverse', name: 'Column Reverse' },
          ],
          defaults: 'row',
        },
        {
          name: 'Align Items',
          property: 'align-items',
          type: 'select',
          options: [
            { value: 'flex-start', name: 'Start' },
            { value: 'center', name: 'Center' },
            { value: 'flex-end', name: 'End' },
            { value: 'stretch', name: 'Stretch' },
            { value: 'baseline', name: 'Baseline' },
          ],
          defaults: 'stretch',
        },
        {
          name: 'Justify Content',
          property: 'justify-content',
          type: 'select',
          options: [
            { value: 'flex-start', name: 'Start' },
            { value: 'center', name: 'Center' },
            { value: 'flex-end', name: 'End' },
            { value: 'space-between', name: 'Space Between' },
            { value: 'space-around', name: 'Space Around' },
            { value: 'space-evenly', name: 'Space Evenly' },
          ],
          defaults: 'flex-start',
        },
        {
          name: 'Wrap',
          property: 'flex-wrap',
          type: 'select',
          options: [
            { value: 'nowrap', name: 'No Wrap' },
            { value: 'wrap', name: 'Wrap' },
            { value: 'wrap-reverse', name: 'Wrap Reverse' },
          ],
          defaults: 'nowrap',
        },
        {
          name: 'Align Content',
          property: 'align-content',
          type: 'select',
          options: [
            { value: 'flex-start', name: 'Start' },
            { value: 'center', name: 'Center' },
            { value: 'flex-end', name: 'End' },
            { value: 'space-between', name: 'Space Between' },
            { value: 'space-around', name: 'Space Around' },
            { value: 'stretch', name: 'Stretch' },
          ],
          defaults: 'stretch',
        },
      ],
    },
    {
      // Define the "Grid" sector for grid properties
      name: 'Grid',
      open: false,
      buildProps: ['grid-template-columns', 'grid-template-rows', 'gap', 'justify-items', 'align-items'],
      properties: [
        {
          name: 'Columns',
          property: 'grid-template-columns',
          type: 'text',
          defaults: '1fr 1fr',
        },
        {
          name: 'Rows',
          property: 'grid-template-rows',
          type: 'text',
          defaults: 'auto',
        },
        {
          name: 'Justify Items',
          property: 'justify-items',
          type: 'select',
          options: [
            { value: 'start', name: 'Start' },
            { value: 'center', name: 'Center' },
            { value: 'end', name: 'End' },
            { value: 'stretch', name: 'Stretch' },
          ],
          defaults: 'stretch',
        },
        {
          name: 'Align Items',
          property: 'align-items',
          type: 'select',
          options: [
            { value: 'start', name: 'Start' },
            { value: 'center', name: 'Center' },
            { value: 'end', name: 'End' },
            { value: 'stretch', name: 'Stretch' },
          ],
          defaults: 'stretch',
        },
        
        {
            name: 'Gaps',
            property: 'gap',
            type: 'composite',
            properties: [
                {
                    name: 'Row Gap',
                    property: 'row-gap', 
                    type: 'integer',
                    units: ['px', 'rem'],
                    defaults: '0',
                },
                {
                    name: 'Column Gap',
                    property: 'column-gap',
                    type: 'integer',
                    units: ['px', 'rem'],
                    defaults: '0',
                },
            ],
        },
      ],
    },
    {
      // Define the "Spacing" sector for padding and margin
      name: 'Spacing',
      open: true,
      buildProps: ['margin', 'padding', 'size'],
      properties: [
        {                   
            name: 'Size',
            property: 'size',
            type: 'composite',
            properties: [
                {
                    name: 'Width',
                    property: 'width',
                    type: 'integer',
                    units: ['px', 'rem'],
                    defaults: '0',
                },
                {
                    name: 'Height',
                    property: 'height',
                    type: 'integer',
                    units: ['px', 'rem'],
                    defaults: '0',
                },
            ],
        },
        {
          name: 'Margin',
          property: 'margin',
          type: 'composite',
          properties: [
            {
              name: 'Top',
              property: 'margin-top',
              type: 'integer',
              units: ['px', 'rem'],
              defaults: '0',
            },
            {
              name: 'Right',
              property: 'margin-right',
              type: 'integer',
              units: ['px', 'rem'],
              defaults: '0',
            },
            {
              name: 'Bottom',
              property: 'margin-bottom',
              type: 'integer',
              units: ['px', 'rem'],
              defaults: '0',
            },
            {
              name: 'Left',
              property: 'margin-left',
              type: 'integer',
              units: ['px', 'rem'],
              defaults: '0',
            },
          ],
        },
        {
          name: 'Padding',
          property: 'padding',
          type: 'composite',
          properties: [
            {
              name: 'Top',
              property: 'padding-top',
              type: 'integer',
              units: ['px', 'rem'],
              defaults: '0',
            },
            {
              name: 'Right',
              property: 'padding-right',
              type: 'integer',
              units: ['px', 'rem'],
              defaults: '0',
            },
            {
              name: 'Bottom',
              property: 'padding-bottom',
              type: 'integer',
              units: ['px', 'rem'],
              defaults: '0',
            },
            {
              name: 'Left',
              property: 'padding-left',
              type: 'integer',
              units: ['px', 'rem'],
              defaults: '0',
            },
          ],
        },
      ],
    },
    {
      // Define the "Typography" sector for font styling
      name: 'Typography',
      open: true,
      buildProps: ['font-size', 'font-weight', 'color', 'line-height', 'letter-spacing'],
      properties: [
        {
          name: 'Font Size',
          property: 'font-size',
          type: 'integer',
          units: ['px', 'rem'],
          defaults: '16',
          min: 8,
        },
        {
          name: 'Font Weight',
          property: 'font-weight',
          type: 'select',
          options: [
            { value: '100', name: 'Thin' },
            { value: '200', name: 'Extra Light' },
            { value: '300', name: 'Light' },
            { value: '400', name: 'Normal' },
            { value: '500', name: 'Medium' },
            { value: '600', name: 'Semi Bold' },
            { value: '700', name: 'Bold' },
            { value: '800', name: 'Extra Bold' },
            { value: '900', name: 'Black' },
          ],
          defaults: '400',
        },
        {
          name: 'Text Color',
          property: 'color',
          type: 'color',
          defaults: '#000000',
        },
        {
          name: 'Line Height',
          property: 'line-height',
          type: 'integer',
          units: ['px', 'rem'],
          defaults: '1.5',
        },
        {
          name: 'Letter Spacing',
          property: 'letter-spacing',
          type: 'integer',
          units: ['px'],
          defaults: '0',
        },
      ],
    },
    {
      // Define the "Background" sector for background color and images
      name: 'Background',
      open: false,
      buildProps: ['background-color', 'background-image', 'background-repeat', 'background-size'],
      properties: [
        {
          name: 'Background Color',
          property: 'background-color',
          type: 'color',
          defaults: '#ffffff',
        },
        {
          name: 'Background Image',
          property: 'background-image',
          type: 'file',
          defaults: '',
        },
        {
          name: 'Background Repeat',
          property: 'background-repeat',
          type: 'select',
          options: [
            { value: 'no-repeat', name: 'No Repeat' },
            { value: 'repeat', name: 'Repeat' },
            { value: 'repeat-x', name: 'Repeat X' },
            { value: 'repeat-y', name: 'Repeat Y' },
          ],
          defaults: 'no-repeat',
        },
        {
          name: 'Background Size',
          property: 'background-size',
          type: 'select',
          options: [
            { value: 'auto', name: 'Auto' },
            { value: 'cover', name: 'Cover' },
            { value: 'contain', name: 'Contain' },
          ],
          defaults: 'cover',
        },
      ],
    },
    {
      // Define the "Borders" sector for adding border styling options
      name: 'Borders',
      open: false,
      buildProps: ['border-width', 'border-style', 'border-color', 'border-radius'],
      properties: [
        {
          name: 'Border Width',
          property: 'border-width',
          type: 'integer',
          units: ['px'],
          defaults: '0',
        },
        {
          name: 'Border Style',
          property: 'border-style',
          type: 'select',
          options: [
            { value: 'none', name: 'None' },
            { value: 'solid', name: 'Solid' },
            { value: 'dashed', name: 'Dashed' },
            { value: 'dotted', name: 'Dotted' },
          ],
          defaults: 'solid',
        },
        {
          name: 'Border Color',
          property: 'border-color',
          type: 'color',
          defaults: '#000000',
        },
        {
          name: 'Border Radius',
          property: 'border-radius',
          type: 'integer',
          units: ['px'],
          defaults: '0',
        },
      ],
    },
    {
      // Define the "Shadows" sector for adding shadows
      name: 'Shadows',
      open: false,
      buildProps: ['box-shadow'],
      properties: [
        {
          name: 'Box Shadow',
          property: 'box-shadow',
          type: 'text',
          defaults: 'none',
        },
      ],
    },
  ]