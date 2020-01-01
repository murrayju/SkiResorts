// @flow
import EventEmitter from 'events';

type EventName = 'NEW_WEATHER_DATA' | 'NEW_RESORT_DATA' | 'AREA_OPENED';

export default class Emitter extends EventEmitter {
  emit(name: EventName, ...data: mixed[]) {
    super.emit(name, ...data);
  }

  on(name: EventName, fn: function) {
    super.on(name, fn);
  }
}
