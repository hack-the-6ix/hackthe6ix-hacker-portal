<template>
  <div v-if="!loading" class="calendar">
    <div
      :style="{
        // TODO: Calculate based on sum of columns of each day
        '--columns': scheduleInfo.dates.size * 48 + 2,
        '--rows': types.size,
      }"
      class="calendar__body"
      ref="body"
    >
      <div
        v-for="i in scheduleInfo.dates.size * 24"
        class="calendar__col-line calendar__col-line--vertical"
        :style="{ '--offset': i * 2 + 1 }"
        :key="i"
      />
      <div
        v-for="i in types.size"
        class="calendar__col-line calendar__col-line--horizontal"
        :style="{ '--offset': i + 2 }"
        :key="i"
      />
      <template v-for="(date, i) in scheduleInfo.dates" :key="date">
        <Typography
          :style="
            cssPosStyle({
              col: i * 48 + 3,
              span: scheduleInfo.dates.size === i + 1 ? 2 : 48,
            })
          "
          :class="[
            'calendar__col calendar__col--date',
            i || 'calendar__col--pure',
          ]"
          :data-idx="i"
          color="dark-navy"
          type="heading4"
          as="p"
        >
          {{ formatDate(date) }}
        </Typography>
        <div
          :class="`calendar__col calendar__col--anchor calendar__col--anchor--${i}`"
          :style="
            cssPosStyle({
              col: i * 48 + 3,
              span: scheduleInfo.dates.size === i + 1 ? 2 : 48,
            })
          "
        />
      </template>
      <div
        v-for="i in scheduleInfo.dates.size * 24"
        :class="[
          'calendar__col calendar__col--time',
          i === 1 && 'calendar__col--pure',
        ]"
        :style="
          cssPosStyle({
            col: i * 2 + 1,
            span: 2,
            row: 2,
          })
        "
        :key="i"
      >
        {{ displayHour(i - 1) }}
      </div>
      <template v-for="([id, info], i) in types" :key="id">
        <div
          class="calendar__col calendar__col--type"
          :style="{
            ...cssPosStyle({
              row: i + 3,
              span: 2,
            }),
            '--background-color': info.BackgroundColor,
            '--color': info.Color,
          }"
        >
          {{ info['Name'] }}
        </div>
        <div
          class="calendar__col calendar__col--event"
          v-for="(event, j) in scheduleInfo.byType[id]"
          :style="{
            ...getEventPosition(event, i + 3),
            '--max-span':
              (j + 1 !== scheduleInfo.byType[id].length
                ? getDatePosition(scheduleInfo.byType[id][j + 1].get('Start'))
                : getDatePosition(event.get('End'))) -
              getDatePosition(event.get('Start')),
            '--background-color': getEventSpan(event)
              ? info.BackgroundColor
              : 'transparent',
            '--color': info.Color,
          }"
          :key="event.id"
        >
          <button @click="currentEvent = event" class="calendar__col-frame">
            <div class="calendar__col-content">
              <Typography
                class="calendar__text--truncated"
                color="dark-navy"
                type="small"
                as="p"
              >
                {{ event.get('Name') }}
              </Typography>
              <Typography
                class="calendar__info"
                color="disabled"
                type="xxsmall"
                as="p"
              >
                {{ getDateRange(event) }} | {{ event.get('Platform') ?? 'N/A' }}
              </Typography>
            </div>
          </button>
        </div>
      </template>
      <div
        class="calendar__col calendar__col--line"
        :style="setNow"
        v-if="setNow"
      />
      <div class="calendar__col--cover" />
    </div>
    <div class="calendar__controls">
      <div class="calendar__buttons">
        <Typography
          class="calendar__button"
          :disabled="!hasPrev"
          color="dark-navy"
          @click="prev"
          type="small"
          as="button"
        >
          <i class="fas fa-angle-left" /> Yesterday
        </Typography>
        <Typography
          class="calendar__button"
          :disabled="!hasNext"
          color="dark-navy"
          @click="next"
          type="small"
          as="button"
        >
          Tomorrow <i class="fas fa-angle-right" />
        </Typography>
        <Typography
          class="calendar__button"
          color="dark-navy"
          @click="toNow"
          v-if="setNow"
          type="small"
          as="button"
        >
          Now
        </Typography>
      </div>
      <Typography
        ref="noopener noreferrer"
        class="calendar__button"
        :href="calendarLink"
        color="dark-navy"
        target="_blank"
        type="small"
        as="a"
      >
        <i class="fas fa-download" /> Download
      </Typography>
    </div>
    <Typography
      type='small'
      color='dark-grey'
    >
      The calendar is in {{ new Date().toTimeString().slice(9) }} time
    </Typography>
    <CalendarModal
      v-model="currentEvent"
      v-if="currentEvent"
      :types="types"
      :hosts="hosts"
    />
  </div>
</template>

<script>
import Airtable from 'airtable';
import Color from 'color';
import CalendarModal from '@/components/CalendarModal';
import Typography from '@/components/Typography';

function mapRecords(data, transform = (v) => v) {
  return data.reduce(
    (acc, field) => acc.set(field.id, transform(field.fields)),
    new Map(),
  );
}

export default {
  name: 'Calendar',
  components: {
    CalendarModal,
    Typography,
  },
  data() {
    return {
      airtable: Airtable.base(process.env.VUE_APP_AIRTABLE_BASE),
      currentDate: new Date().toISOString().split('Z')[0],
      currentEvent: null,
      awaitDate: null,
      now: new Date(),
      loading: true,
      events: null,
      hosts: null,
      types: null,
    };
  },
  async beforeMount() {
    await Promise.all([
      this.airtable
        .table('Events')
        .select({
          sort: [{ field: 'Start' }],
        })
        .all()
        .then((data) => (this.events = data)),
      this.airtable
        .table('Hosts')
        .select({
          fields: ['Name', 'Affiliation'],
        })
        .all()
        .then((data) => (this.hosts = mapRecords(data))),
      this.airtable
        .table('Type of Events')
        .select({
          filterByFormula: 'Hidden=FALSE()',
          fields: ['Name', 'Color'],
        })
        .all()
        .then((data) => (this.types = mapRecords(data, this.transformType))),
    ]);

    this.events = this.events
      .filter((event) => {
        const type = event.get('Type of Event')?.[0];
        return type && this.types.get(type);
      })
      .map((event) => {
        const start = new Date(event.get('Start'));
        start.setHours(start.getHours() + 4);
        const end = new Date(event.get('End'));
        end.setHours(end.getHours() + 4);
        event.set('Start', start);
        event.set('End', end);
        return event;
      });

    const now = new Date(this.currentDate);
    const dates = [...this.scheduleInfo.dates];
    this.currentDate =
      dates.find(
        (date) => date === this.currentDate || now < new Date(this.currentDate),
      ) ?? (now < new Date(dates[0]) ? dates[0] : dates.slice(-1));
    this.loading = false;
  },
  watch: {
    loading(val) {
      if (!val) {
        setTimeout(() => (this.now = new Date()), 60000);
        this.now = new Date();

        this.$nextTick(() => {
          if (this.setNow) {
            this.toNow();
          }
          const observer = new IntersectionObserver(
            ([event]) => {
              const idx = event.target.getAttribute('data-idx');
              const currentDate = [...this.scheduleInfo.dates][idx];
              if (!currentDate) return;
              if (!this.awaitDate || currentDate === this.awaitDate) {
                this.currentDate = currentDate;
                this.awaitDate = null;
              }
            },
            [1],
          );
          this.$refs.body
            .getElementsByClassName('calendar__col--date')
            .forEach((el) => {
              observer.observe(el);
            });
        });
      }
    },
    awaitDate(val) {
      if (val !== null) {
        const idx = [...this.scheduleInfo.dates].indexOf(val);
        const body = this.$refs.body;
        const element = body.getElementsByClassName(
          `calendar__col--anchor--${idx}`,
        )[0];
        const padding = body.getElementsByClassName('calendar__col--cover')[0];
        body.scrollTo({
          left: element.offsetLeft - padding.offsetWidth - body.offsetLeft,
          behavior: 'smooth',
        });
        window.setTimeout(() => {
          if (this.awaitDate) {
            this.currentDate = this.awaitDate;
            this.awaitDate = null;
          }
        }, 500);
      }
    },
  },
  computed: {
    calendarLink() {
      return process.env.VUE_APP_AIRTABLE_CALENDAR;
    },
    hasPrev() {
      return this.currentDate !== [...this.scheduleInfo.dates][0];
    },
    hasNext() {
      return this.currentDate !== [...this.scheduleInfo.dates].slice(-1)[0];
    },
    scheduleInfo() {
      if (!this.events || !this.hosts || !this.types) return {};
      const byType = Array.from(this.types.keys()).reduce((acc, type) => {
        acc[type] = [];
        return acc;
      }, {});
      const timeInfo = new Map();
      const dates = new Set();

      // Sort events and infer info in a single loop for SPEED *Plays running in the 90s*
      this.events.forEach((event) => {
        const type = event.get('Type of Event')?.[0];
        let serializedDate = event.get('Start').toLocaleDateString();
        if (!dates.has(serializedDate)) {
          dates.add(serializedDate);
          timeInfo.set(serializedDate, {
            offset: 0,
            start: 23,
            end: 0,
          });
        }

        serializedDate = event.get('End').toLocaleDateString();
        if (!dates.has(serializedDate)) {
          dates.add(serializedDate);
          timeInfo.set(serializedDate, {
            offset: 0,
            start: 23,
            end: 0,
          });
        }

        byType[type].push(event);
      });

      this.events.forEach((event) => {
        const serializedDate = event.get('Start').toLocaleDateString();

        const _start = new Date(event.get('Start'));
        const _end = new Date(event.get('End'));
        const info = timeInfo.get(serializedDate);

        // Set the min/max of day
        info.start = Math.min(_start.getHours(), info.start);
        info.end = Math.max(_end.getHours(), info.end);

        // Different date, add offset to next day
        if (_end.getDate() !== _start.getDate()) {
          const tmrInfo = timeInfo.get(event.get('End').toLocaleDateString());
          tmrInfo.offset = Math.max(tmrInfo.offset, _end.getHours());
        }
      });

      return {
        timeInfo,
        byType,
        dates,
      };
    },
    totalColumns() {
      const { timeInfo } = this.scheduleInfo;
      return [...timeInfo.values()].reduce(
        (acc, info) =>
          acc +
          info.end -
          info.start +
          info.offset +
          Boolean(info.offset || info.end !== 23),
        0,
      );
    },
    // This is where the math pain happens...
    setNow() {
      const { dates: _dates } = this.scheduleInfo;
      const [start, ...dates] = [..._dates];
      const end = dates.slice(-1)[0];
      
      console.log(start, end, this.now);

      if (this.now < new Date(start) || this.now > new Date(end)) {
        return;
      }

      return {
        '--col': this.getDatePosition(this.now) + 3,
        '--offset': (this.now.getMinutes() % 30) / 30,
        '--span': 1,
      };
    },
  },
  methods: {
    next() {
      if (this.awaitDate) return;
      const dates = [...this.scheduleInfo.dates];
      const idx = dates.indexOf(this.currentDate);
      this.awaitDate = dates[idx + 1];
    },
    prev() {
      if (this.awaitDate) return;
      const dates = [...this.scheduleInfo.dates];
      const idx = dates.indexOf(this.currentDate);
      this.awaitDate = dates[idx - 1];
    },
    toNow() {
      const element = this.$refs.body?.getElementsByClassName(
        'calendar__col--line',
      )?.[0];

      if (element) {
        return element.scrollIntoView({ behavior: 'smooth', inline: 'center' });
      }
    },
    formatDate(_date) {
      const _d = new Date(_date);
      const date = new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }).format(_d);

      let dateTH = 'th';
      switch (_d.getDate().toString().charAt(1)) {
        case '1':
          dateTH = 'st';
          break;
        case '2':
          dateTH = 'nd';
          break;
        case '3':
          dateTH = 'rd';
          break;
      }

      return date + dateTH;
    },
    cssPosStyle(config = {}) {
      return {
        '--span': config.span || 2,
        '--col': config.col || 1,
        '--row': config.row || 1,
      };
    },
    transformType(type) {
      return {
        ...type,
        BackgroundColor: Color(type.Color).mix(Color('white'), 0.9).hex(),
      };
    },
    getDatePosition(date) {
      const dateIndex = [...this.scheduleInfo.dates].indexOf(
        date.toLocaleDateString(),
      );
      const minute = date.getMinutes();
      const hour = date.getHours();

      return dateIndex * 48 + parseInt(hour) * 2 + (parseInt(minute) >= 30);
    },
    getEventSpan(event) {
      const start = event.get('Start');
      const end = event.get('End');
      return this.getDatePosition(end) - this.getDatePosition(start);
    },
    getEventPosition(event, row) {
      const start = event.get('Start');

      return this.cssPosStyle({
        col: this.getDatePosition(start) + 3,
        span: this.getEventSpan(event),
        row,
      });
    },
    displayHour(offset, isHalf) {
      const period = offset % 24 >= 12 ? 'pm' : 'am';
      const hour = offset % 12 || 12;
      return `${hour}:${isHalf ? '30' : '00'}${period}`;
    },
    getDateRange(event) {
      let startTime = this.displayHour(
        event.get('Start').getHours(),
        event.get('Start').getMinutes(),
      );
      const endTime = this.displayHour(
        event.get('End').getHours(),
        event.get('End').getMinutes(),
      );

      const span = this.getEventSpan(event);

      if (startTime.slice(-2)[0] === endTime.slice(-2)[0]) {
        startTime = startTime.slice(0, -2);
      }
      return `${span ? `${startTime} - ` : ''}${endTime}`.replace(/:00/g, '');
    },
  },
};
</script>

<style lang="scss">
@use '@/styles/mixins';
@use '@/styles/colors';
@use '@/styles/units';

$_col-width: units.spacing(30);

.calendar {
  &__body {
    grid-template-columns: repeat(var(--columns), $_col-width);
    grid-template-rows: repeat(var(--rows), auto);
    overflow: auto;
    display: grid;
  }

  &__col {
    grid-column: var(--col) / var(--span) span;
    box-sizing: border-box;
    grid-row: var(--row);

    &--cover {
      background-color: colors.css-color(white);
      grid-column: 1 / 2 span;
      grid-row: 1 / 2 span;
      position: sticky;
      z-index: 3;
      left: 0;
    }

    &--date {
      border-left: 1px solid colors.css-color(light-teal, $alpha: 0.5);
      padding: 0 units.spacing(4) units.spacing(1);
      background-color: colors.css-color(white);
      left: $_col-width * 2;
      position: sticky;
    }

    &--time {
      border-left: 1px solid colors.css-color(light-teal, $alpha: 0.5);
      padding: 0 units.spacing(4) units.spacing(3);
    }

    &--pure {
      border-left: 0;
    }

    &--type {
      border-top: 1px solid colors.css-color(light-teal, $alpha: 0.5);
      background-color: colors.css-color(white);
      padding: units.spacing(6) units.spacing(2);
      align-items: center;
      position: sticky;
      display: flex;
      z-index: 3;
      left: 0;

      &::before {
        margin-right: units.spacing(2.5);
        background-color: var(--color);
        width: units.spacing(1);
        border-radius: 999px;
        height: 100%;
        content: '';
      }
    }

    &--event {
      padding: units.spacing(1);
      padding-left: 0;
    }

    &--anchor {
      width: 0;
      height: 0;
      opacity: 0;
    }

    &--line {
      @include mixins.transition(transform);
      transform: translateX(calc(var(--offset) * #{$_col-width}))
        translateX(#{units.spacing(-0.5)});
      background-color: colors.css-color(red);
      grid-row: 3 / var(--rows) span;
      width: units.spacing(1);
      position: relative;
      z-index: 2;

      &::before {
        inset: units.spacing(-3) auto auto units.spacing(-1);
        background-color: colors.css-color(red);
        height: units.spacing(3);
        width: units.spacing(3);
        border-radius: 999px;
        position: absolute;
        content: '';
      }
    }
  }

  &__col-line {
    background-color: colors.css-color(light-teal, $alpha: 0.5);
    &--vertical {
      grid-row: 3 / var(--rows) span;
      grid-column: var(--offset);
      height: 100%;
      width: 1px;

      &:first-of-type {
        left: $_col-width * 2;
        grid-row: 1 / calc(var(--rows) + 2) span;
        position: sticky;
        z-index: 1;
      }
    }

    &--horizontal {
      grid-column: 1 / calc(var(--columns) + 1) span;
      grid-row: var(--offset);
      height: 1px;
      width: 100%;
    }
  }

  &__col-frame {
    border: none;
    border-left: units.spacing(1) solid var(--color);
    border-bottom-right-radius: units.spacing(2);
    border-top-right-radius: units.spacing(2);
    background-color: var(--background-color);
    text-align: start;
    cursor: pointer;
    height: 100%;
    width: 100%;
  }

  &__col-content {
    min-width: calc(var(--max-span) * #{$_col-width - units.spacing(4)});
    padding: units.spacing(3) units.spacing(2);
    box-sizing: border-box;
  }

  &__info {
    display: flex;
  }

  &__text {
    &--truncated {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }

  &__buttons {
    grid-template-columns: repeat(3, 1fr);
    grid-gap: units.spacing(4);
    display: grid;

    @include mixins.media(phone) {
      grid-template-columns: 1fr;
      margin-bottom: units.spacing(4);
    }
  }

  &__controls {
    justify-content: space-between;
    padding: units.spacing(6) 0 units.spacing(3);
    display: flex;

    @include mixins.media(phone) {
      flex-direction: column;
    }
  }

  &__button {
    @include mixins.transition(background-color border-color color);
    border: 1px solid colors.css-color(dark-navy);
    padding: units.spacing(1) units.spacing(5);
    background-color: transparent;
    text-decoration: none;
    border-radius: 999px;
    text-align: center;
    cursor: pointer;

    &:disabled {
      background-color: colors.css-color(disabled, $alpha: 0.12);
      border-color: colors.css-color(disabled);
      color: colors.css-color(disabled);
      cursor: not-allowed;
    }

    &:hover:not(:disabled),
    &:focus:not(:disabled) {
      background-color: colors.css-color(dark-navy, $alpha: 0.06);
    }

    &:active:not(:disabled) {
      background-color: colors.css-color(dark-navy, $alpha: 0.12);
    }
  }
}
</style>
