'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    async afterFind(result, params, popluate) {
      const { receiver } = params;
      const data = await strapi.query('history')
        .model.query(q => {
          q.where('receiver', receiver);
          q.update('checked', true)
        })
        .fetchAll()
        console.log(data)
    }
  }
};
