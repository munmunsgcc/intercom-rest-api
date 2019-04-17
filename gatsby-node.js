/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

const parser = require('body-parser');
const Intercom = require('intercom-client');
const token = require('./token.json');

exports.onCreateDevServer = ({ app }) => {
  const jsonParser = parser.json();
  const client = new Intercom.Client({ token: token.access_token });
  const callMethod = ({
    type, method, data, res,
  }) => {
    if (typeof data === 'undefined') {
      client[type][method]()
        .then((response) => {
          res.json(response.body);
        })
        .catch((err) => {
          res.json(err);
        });
    } else {
      client[type][method](data)
        .then((response) => {
          res.json(response.body);
        })
        .catch((err) => {
          res.json(err);
        });
    }
  };

  app.post('/users', jsonParser, (req, res) => {
    let runMethod = false;

    Object.keys(req.body).forEach((method) => {
      const data = req.body[method] === true ? undefined : req.body[method];

      if (typeof client.users[method] === 'function') {
        // .create(//data) -> { email : '', custom_attributes: { anything: 1 } } to create 1 user
        // .update(//data) -> { email: '', custom_attributes: { can_change: 1 } } to update 1 user
        // .list() -> get full list of users. returns in pagination
        // .find(//data) -> can use { email: '' } || { id: '' } || { user_id: '' } to find 1 user
        // .scroll.each({}).then() -> scroll through user list
        // .listBy(//data) -> can use { tag_id: '' } || { segment_id: '' } to find matching users
        // .archive(//data) -> use { id: '' } to archive 1 user. This is not a hard delete.
        // https://developers.intercom.com/intercom-api-reference/reference#archive-a-user
        // .requestPermanentDeletion(intercomid) -> Permanently remove 1 user after 90 days using intercomid
        // .requestPermanentDeletionByParams(//data) -> can use { id: '' } || { user_id: '' } || { email: '' }
        // to remove 1 user permanently
        callMethod({
          type: 'users',
          method,
          data,
          res,
        });
        runMethod = true;
      }
    });

    if (runMethod === false) {
      res.json({ error: 'No matching method found' });
    }
  });

  app.post('/leads', jsonParser, (req, res) => {
    let runMethod = false;

    Object.keys(req.body).forEach((method) => {
      const data = req.body[method] === true ? undefined : req.body[method];

      if (typeof client.leads[method] === 'function') {
        // .create() -> dun pass anything also can create 1 lead
        // .create(//data) -> { email : '' } to create 1 lead
        // .update(//data) -> { id: '', email: '' } to update 1 lead by id
        // .list() -> lists all leads
        // .scroll.each({}).then() -> scroll through each lead list
        // .listBy(//data) -> { email: '' } lists leads by matching email
        // .find(//data) -> { id: '' } find 1 lead by id
        // .delete(//data) -> { id: '' } deletes 1 lead by id
        // .convert(//data) -> { contact: { user_id: '' }, user: { email: '' } } converts 1 lead to user
        callMethod({
          type: 'leads',
          method,
          data,
          res,
        });
        runMethod = true;
      }
    });

    if (runMethod === false) {
      res.json({ error: 'No matching method found' });
    }
  });

  app.post('/visitors', jsonParser, (req, res) => {
    let runMethod = false;

    Object.keys(req.body).forEach((method) => {
      const data = req.body[method] === true ? undefined : req.body[method];

      if (typeof client.visitors[method] === 'function') {
        // .update(//data) -> { id: '', email: '' } to update 1 visitor by ID
        // .find(//data) -> { id: '' } or { 'user_id': '' } to find 1 visitor by ID
        // .convert(//data) -> { visitor: { user_id: '' }, user: { email: '' }, type: 'user' }
        // to convert 1 visitor to user
        // .convert(//data) -> { visitor: { user_id: '' }, type: 'lead' } to convert 1 visitor to lead
        callMethod({
          type: 'visitors',
          method,
          data,
          res,
        });
        runMethod = true;
      }
    });

    if (runMethod === false) {
      res.json({ error: 'No matching method found' });
    }
  });
};
