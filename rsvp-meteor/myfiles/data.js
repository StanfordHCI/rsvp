import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Images = new Mongo.Collection('images');

if (Meteor.isServer) {
  /*Meteor.publish('images', function images() {
    console.log(Images.find().count());
    return Images.find();
  });*/
}

