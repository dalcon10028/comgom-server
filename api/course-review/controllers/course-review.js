'use strict';

const { sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  /**
   * Retrieve a record.
   *
   * @return {Object}
   */

  async findOne(ctx) {
    const { id } = ctx.params;
    const user = ctx.state.user;
    if (user.point === 0) {
      return ctx.throw(403, '포인트가 부족합니다');
    }
    const entity = await strapi.services['course-review'].findOne({ id });
    await strapi.query('user', 'users-permissions').update({ id: user.id }, { point: user.point - 5 });
    return sanitizeEntity(entity, { model: strapi.models['course-review'] });
  },
};
