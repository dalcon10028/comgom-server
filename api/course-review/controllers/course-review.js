'use strict';

const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

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
    if (ctx.query._q) {
      entities = await strapi.services['course-review'].search(ctx.query);
    } else {
      entities = await strapi.services['course-review'].find(ctx.query);
    }
    entities = entities.map(entity => {
      delete entity.author;
      delete entity.homework;
      delete entity.team;
      delete entity.credit;
      delete entity.review;
      entity.like = entity.likes.length;
      delete entity.likes;
      return entity;
    });
    return entities.map(entity => sanitizeEntity(entity, { model: strapi.models['course-review'] }));
  },

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
    entity.author = { id: entity.author.id };
    const { checked_reviews } = await strapi.query('user', 'users-permissions').findOne({ id:user.id });
    let isChecked = false;
    checked_reviews.forEach(review => {
      if (review.id == id) isChecked = true;
    });
    if (!isChecked) {
      await strapi.query('user', 'users-permissions').update({ id: user.id }, { point: user.point - 5, checked_reviews: [ ...checked_reviews, id ] });
      await strapi.query('history').create({ receiver: user.id, type: 'point', message: '-5포인트: 강의리뷰 읽기', checked: false })
    }
    return sanitizeEntity(entity, { model: strapi.models['course-review'] });
  },

  /**
   * Create a record.
   *
   * @return {Object}
   */

  async create(ctx) {
    let entity;
    const user = ctx.state.user;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services['course-review'].create(data, { files });
    } else {
      entity = await strapi.services['course-review'].create(ctx.request.body);
    }
    const { course_reviews, checked_reviews } = await strapi.query('user', 'users-permissions').findOne({ id:user.id });
    await strapi.query('user', 'users-permissions')
      .update(
        { id: user.id },
        { point: course_reviews.length === 1 ? user.point + 40 : user.point + 10, checked_reviews: [ ...checked_reviews, entity.id ] });
    await strapi
      .query('history')
      .create({
        receiver: user.id,
        type: 'point',
        message: `+${course_reviews.length === 1 ? 40 : 10}포인트: 강의리뷰 작성`, checked: false, target: entity.id })
    return sanitizeEntity(entity, { model: strapi.models['course-review'] });
  },

  /**
   * Update a record.
   *
   * @return {Object}
   */

  async update(ctx) {
    const { id } = ctx.params;

    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services['course-review'].update({ id }, data, {
        files,
      });
    } else {
      if (ctx.request.body.author !== ctx.state.user.id)
        return ctx.throw(403, '작성자 본인이 아닙니다.');
      entity = await strapi.services['course-review'].update({ id }, ctx.request.body);
    }

    return sanitizeEntity(entity, { model: strapi.models['course-review'] });
  },
};
