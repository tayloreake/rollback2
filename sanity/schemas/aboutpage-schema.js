export default {
  name: "aboutPage",
  title: "About Page",
  type: "document",
  options: {
    singleInstance: true,
  },
  fields: [
    {
      name: "aboutheroImage",
      title: "About Hero Image",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "alt",
      title: "Alternative Text",
      type: "string",
    },
    {
      name: "aboutTitle",
      title: "About Title",
      type: "string",
    },
    {
      name: "aboutDescription",
      title: "About Description",
      type: "text",
    },
    {
      name: "visionTitle",
      title: "Vision Title",
      type: "string",
    },
    {
      name: "visionDescription",
      title: "Vision Description",
      type: "text",
    },
    {
      name: "missionTitle",
      title: "Mission Title",
      type: "string",
    },
    {
      name: "missionDescription",
      title: "Mission Description",
      type: "text",
    },
    {
      name: "whatWeDoTitle",
      title: "What We Do Title",
      type: "string",
    },
    {
      name: "whatWeDoDescription",
      title: "What We Do Description",
      type: "text",
    },
    {
      name: "whatWeDoCard",
      title: "What We Do Card",
      type: "object",
      fields: [
        {
          name: "whatWeDoCardTitle",
          title: "What We Do Card Title",
          type: "string",
        },
        {
          name: "whatWeDoCardDescription",
          title: "What We Do Card Description",
          type: "text",
        },
        {
          name: "whatWeDoCardImage",
          title: "What We Do Card Image",
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              title: "Alternative Text",
              type: "string",
            },
          ],
        },
      ],
    },
    {
      name: "clientsTitle",
      title: "Clients Title",
      type: "string",
    },
    {
      name: "clientsDescription",
      title: "Clients Description",
      type: "text",
    },
    {
      name: "clientsAccordions",
      title: "Clients Accordions",
      type: "array",
      of: [
        {
          name: "clientsAccordion",
          title: "Clients Accordion",
          type: "object",
          fields: [
            {
              name: "clientsAccordionTitle",
              title: "Clients Accordion Title",
              type: "string",
            },
            {
              name: "clientsAccordionImages",
              title: "Clients Accordion Images",
              type: "array",
              of: [
                {
                  name: "clientsAccordionImage",
                  title: "Clients Accordion Image",
                  type: "image",
                  options: { hotspot: true },
                  fields: [
                    {
                      name: "alt",
                      title: "Alternative Text",
                      type: "string",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
