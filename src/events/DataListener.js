const alertingStatuses = ['pending', 'open'];

export default ({ db, emitter }) => {
  emitter.on('NEW_RESORT_DATA', async (type, data) => {
    if (type !== 'areas') return;
    const results = await db
      .collection(type)
      .find({ name: data.name, timestamp: { $ne: data.timestamp } })
      .sort({ timestamp: -1 })
      .limit(1)
      .toArray();
    if (!results || !results[0]) return;
    const [lastData] = results;
    if (lastData.status !== data.status && alertingStatuses.includes(data.status)) {
      emitter.emit('AREA_OPENED', data);
    }
  });
};
