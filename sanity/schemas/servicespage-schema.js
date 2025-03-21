export default {
  name: "servicesPage",
  title: "Services Page",
  type: "document",
  options: {
    singleInstance: true,
  },
  fields: [
    {
      name: "servicesHeroImage",
      title: "Services Hero Image",
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
              type: "array",
              of: [
                {
                  type: "block",
                },
              ],
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
            {
              name: "servicesSubServices",
              title: "Services Sub Services",
              type: "array",
              of: [
                {
                  name: "servicesSubService",
                  title: "Services Sub Service",
                  type: "object",
                  fields: [
                    {
                      name: "servicesSubServiceTitle",
                      title: "Services Sub Service Title",
                      type: "string",
                    },
                    {
                      name: "servicesSubServiceDescription",
                      title: "Services Sub Service Description",
                      type: "array",
                      of: [
                        {
                          type: "block",
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
    },
  ],
}
