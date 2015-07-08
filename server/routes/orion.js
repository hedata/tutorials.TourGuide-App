/*
 * ChanChan Orion REST API
 */

var utils = require('../utils');
var orion_url = "orion"; // To be changed to PEP for auth



// Return the list of available entities in Orion
exports.contexts = function(req, res) {
    // TODO: Check auth
    // Is it possible to get all contexts from the API?
    // Right now we get all contexts from a type
    contextType = "Room";


    return_get = function(res, buffer) {
        res.send(buffer);
    };


    var options = {
        host: orion_url,
        port: 10026,
        path: '/NGSI10/contextEntityTypes/'+contextType,
        method: 'GET',
        headers: {
            accept: 'application/json'
        }
    };

    utils.do_get(options, return_get, res); 
};

//Create a new Context subscription in CKAN for an organization
exports.subscribe_context = function(req, res) {
  return_post = function(res, buffer, headers) {
      res.send(buffer);
  };

  var cygnus_ckan_url = "http://localhost";
  var org_id = req.params.org_id;
  var context_id = req.params.context_id;
  var org_port;

    if (org_id == "org_a" || org_id == "organization_a") {
      org_port = "5001";
  } else if (org_id == "org_b" || org_id == "organizatiob_b") {
      org_port = "5002";
  } else {
      res.status(404);
      res.send(err.message || "Org " + org_id + " not found.");
      return;
  }

  post_data = {
      "entities": [
           {
               "type": context_id,
               "isPattern": "false",
               "id": "FirstEntity"
           }
       ],
       "attributes": [
           "temperature"
       ],
       "reference": cygnus_ckan_url + ":" + org_port +"/notify",
       "duration": "P1M",
       "notifyConditions": [
           {
               "type": "ONCHANGE",
               "condValues": [
                   "pressure"
               ]
           }
       ],
       "throttling": "PT1S"
  };

  post_data = JSON.stringify(post_data);

  headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Content-Length': Buffer.byteLength(post_data)
  };

  var options = {
      host: orion_url,
      port: 10026,
      path: '/NGSI10/subscribeContext',
      method: 'POST',
      headers: headers
  };

  utils.do_post(options, post_data, return_post, res);
};

// Update entities data (temperature)
exports.update_context_temperature = function(req, res) {
  return_post = function(res, buffer, headers) {
      res.send(buffer);
  };

  var org_id = req.params.org_id;
  var context_id = req.params.context_id;
  var temperature_id = req.params.temperature_id;

    post_data = {
        "contextElements": [
                {
                    "type": org_id,
                    "isPattern": "false",
                    "id": context_id,
                    "attributes": [
                    {
                        "name": "temperature",
                        "type": "centigrade",
                        "value": temperature_id
                    },
                    {
                        "name": "pressure",
                        "type": "mmHg",
                        "value": "720"
                    }
                    ]
                }
            ],
            "updateAction": "APPEND"
    };


  post_data = JSON.stringify(post_data);

  headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Content-Length': Buffer.byteLength(post_data)
  };

  var options = {
      host: orion_url,
      port: 10026,
      path: '/NGSI10/updateContext',
      method: 'POST',
      headers: headers
  };

  utils.do_post(options, post_data, return_post, res);
};

// Find the restaurants given a name
exports.get_restaurants = function(req, res) {
  return_post = function(res, buffer, headers) {
      res.send(buffer);
  };

  var name = req.params.name;
  var orion_url = "orion";
  var orion_port = 10026;
  var orion_res_limit = 1000; // Max orion items to avoid pagination

  post_data = {
        "entities": [
         {
             "type": "restaurant",
             "isPattern": "true",
             "id": ".*"+name+".*"
         }]
    };


  post_data = JSON.stringify(post_data);

  headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Content-Length': Buffer.byteLength(post_data)
  };

  var options = {
      host: orion_url,
      port: orion_port,
      path: '/NGSI10/queryContext?limit='+orion_res_limit,
      method: 'POST',
      headers: headers
  };

  utils.do_post(options, post_data, return_post, res);
};

// Update entities in orion
exports.update_entities = function(req, res) {
  return_post = function(res, buffer, headers) {
      res.send(buffer);
  };

  var org_id = req.params.org_id;
  var post_data = JSON.stringify(req.body);

  headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Content-Length': Buffer.byteLength(post_data)
  };

  var options = {
      host: orion_url,
      port: 10026,
      path: '/NGSI10/updateContext',
      method: 'POST',
      headers: headers
  };

  utils.do_post(options, post_data, return_post, res);
};