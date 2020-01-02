import moment from 'moment';

export default ({ limit }) => [
  {
    $match: {
      lastUpdated: {
        $gt: moment()
          .subtract(...limit)
          .toDate(),
      },
    },
  },
  {
    $sort: {
      lastUpdated: 1,
    },
  },
  {
    $group: {
      _id: { resort: '$resort', location: '$location' },
      resort: { $first: '$resort' },
      location: { $first: '$location' },
      data: {
        $push: {
          $mergeObjects: ['$data', { lastUpdated: '$lastUpdated' }],
        },
      },
    },
  },
  {
    $group: {
      _id: '$resort',
      locations: {
        $push: { k: '$location', v: '$data' },
      },
    },
  },
  {
    $replaceRoot: {
      newRoot: { $mergeObjects: ['$$ROOT', { $arrayToObject: '$locations' }] },
    },
  },
  {
    $project: {
      locations: 0,
    },
  },
];
