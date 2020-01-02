import moment from 'moment';

export default ({ limit }) => [
  {
    $match: {
      timestamp: {
        $gt: moment()
          .subtract(...limit)
          .toDate(),
      },
    },
  },
  {
    $sort: {
      timestamp: 1,
    },
  },
  {
    $group: {
      _id: '$name',
      resort: {
        $last: '$resort',
      },
      status: {
        $last: '$status',
      },
      updated: {
        $last: '$timestamp',
      },
      data: {
        $push: {
          status: '$status',
          timestamp: '$timestamp',
        },
      },
    },
  },
  {
    $addFields: {
      lastOpen: {
        $let: {
          vars: {
            filtered: {
              $filter: {
                input: '$data',
                cond: {
                  $eq: ['$$this.status', 'open'],
                },
              },
            },
          },
          in: {
            $let: {
              vars: {
                last: {
                  $arrayElemAt: ['$$filtered', -1],
                },
              },
              in: '$$last.timestamp',
            },
          },
        },
      },
      lastClosed: {
        $let: {
          vars: {
            filtered: {
              $filter: {
                input: '$data',
                cond: {
                  $eq: ['$$this.status', 'closed'],
                },
              },
            },
          },
          in: {
            $let: {
              vars: {
                last: {
                  $arrayElemAt: ['$$filtered', -1],
                },
              },
              in: '$$last.timestamp',
            },
          },
        },
      },
      lastPending: {
        $let: {
          vars: {
            filtered: {
              $filter: {
                input: '$data',
                cond: {
                  $eq: ['$$this.status', 'pending'],
                },
              },
            },
          },
          in: {
            $let: {
              vars: {
                last: {
                  $arrayElemAt: ['$$filtered', -1],
                },
              },
              in: '$$last.timestamp',
            },
          },
        },
      },
      transitions: {
        $let: {
          vars: {
            reduced: {
              $reduce: {
                input: '$data',
                initialValue: {
                  lastStatus: 'unknown',
                  items: [],
                },
                in: {
                  $cond: {
                    if: {
                      $eq: ['$$value.lastStatus', '$$this.status'],
                    },
                    then: '$$value',
                    else: {
                      lastStatus: '$$this.status',
                      items: {
                        $concatArrays: ['$$value.items', ['$$this']],
                      },
                    },
                  },
                },
              },
            },
          },
          in: '$$reduced.items',
        },
      },
    },
  },
  {
    $group: {
      _id: '$resort',
      data: {
        $push: {
          name: '$_id',
          status: '$status',
          updated: '$updated',
          transitions: '$transitions',
          lastOpen: '$lastOpen',
          lastClosed: '$lastClosed',
          lastPending: '$lastPending',
        },
      },
    },
  },
];
