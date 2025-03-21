export default {
  name: "landingPage",
  title: "Landing Page",
  type: "document",
  options: {
    singleInstance: true,
  },
  fields: [
    {
      name: "heroTitle",
      title: "Hero Title",
      type: "string",
    },
    {
      name: "heroImage",
      title: "Hero Image",
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
      name: "aboutCards",
      title: "About Cards",
      type: "array",
      of: [
        {
          name: "aboutCard",
          title: "About Card",
          type: "object",
          fields: [
            {
              name: "aboutCardTitle",
              title: "About Card Title",
              type: "string",
            },
            {
              name: "aboutCardDescription",
              title: "About Card Description",
              type: "text",
            },
            {
              name: "aboutCardImage",
              title: "About Card Image",
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
    {
      name: "servicesTitle",
      title: "Services Title",
      type: "string",
    },
    {
      name: "servicesDescription",
      title: "Services Description",
      type: "text",
    },
    {
      name: "servicesCards",
      title: "Services Cards",
      type: "array",
      of: [
        {
          name: "servicesCard",
          title: "Services Card",
          type: "object",
          fields: [
            {
              name: "servicesCardTitle",
              title: "Services Card Title",
              type: "string",
            },
            {
              name: "servicesCardDescription",
              title: "Services Card Description",
              type: "text",
            },
            {
              name: "servicesCardImage",
              title: "Services Card Image",
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
    {
      name: "goalsTitle",
      title: "Goals Title",
      type: "string",
    },
    {
      name: "goalsDescription",
      title: "Goals Description",
      type: "text",
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
