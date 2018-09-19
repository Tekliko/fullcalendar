import { EventInput, EventDef } from './event'
import { DateRange } from '../datelib/date-range'
import { DateEnv } from '../datelib/env'
import { Duration } from '../datelib/duration'
import { DateMarker, startOfDay } from '../datelib/marker'

/*
The plugin system for defining how a recurring event is expanded into individual instances.
*/

export interface ParsedRecurring {
  isAllDay: boolean // last fallback to be used
  duration: Duration | null // signals hasEnd
  typeData: any
}

export interface RecurringType {
  parse: (rawEvent: EventInput, leftoverProps: any, dateEnv: DateEnv) => ParsedRecurring | null
  expand: (typeData: any, eventDef: EventDef, framingRange: DateRange, dateEnv: DateEnv) => DateMarker[]
}


let recurringTypes: RecurringType[] = []

export function registerRecurringType(recurringType: RecurringType) {
  recurringTypes.push(recurringType)
}


export function parseRecurring(eventInput: EventInput, dateEnv: DateEnv, leftovers: any) {
  for (let i = 0; i < recurringTypes.length; i++) {
    let parsed = recurringTypes[i].parse(eventInput, leftovers, dateEnv) as ParsedRecurring

    if (parsed) {
      return { // more efficient way to do this?
        isAllDay: parsed.isAllDay,
        duration: parsed.duration,
        typeData: parsed.typeData,
        typeId: i
      }
    }
  }

  return null
}


/*
Event MUST have a recurringDef
*/
export function expandRecurringRanges(eventDef: EventDef, framingRange: DateRange, dateEnv: DateEnv): DateMarker[] {
  let typeDef = recurringTypes[eventDef.recurringDef.typeId]
  let markers = typeDef.expand(
    eventDef.recurringDef.typeData,
    eventDef,
    framingRange,
    dateEnv
  )

  // the recurrence plugins don't guarantee that all-day events are start-of-day, so we have to
  if (eventDef.isAllDay) {
    markers = markers.map(startOfDay)
  }

  return markers
}