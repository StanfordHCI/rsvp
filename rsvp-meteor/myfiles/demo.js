//import './vars.js'
//import './graph.js'
//import './utils.js'
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Images } from './data.js';
import './body.html';

//Template.body.onCreated(function bodyOnCreated() {
  //this.state = new ReactiveDict();
  //Meteor.subscribe('images');
  console.log(Images)
  var imageCount = Images.find({}).count();
  console.log(imageCount)
  var imageData = Images.find({}).fetch();
  var data = {};
  for (var i = 0; i < imageCount; i++) {
    data[imageData[i].url] = imageData[i];
  }
  //console.log(data)
//});


Template.body.helpers({
  images() {
    return Images.find({});
  },
});
