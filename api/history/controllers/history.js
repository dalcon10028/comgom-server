'use strict';

const { sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  /**
   * Retrieve records.
   *
   * @return {Array}
   */

  async find(ctx) {
    let entities;
    const user = ctx.state.user;
    if (ctx.query._q) {
      entities = await strapi.services.history.search(ctx.query);
    } else {
      entities = await strapi.services.history.find(ctx.query);
    }
    entities = entities.filter(({ receiver }) => receiver.id === user.id);
    return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.history }));
  },
};
