<template>
  <div v-if='!loading' class='schedule'>
    <div
      :style='{
        // TODO: Calculate based on sum of columns of each day
        "--columns": (scheduleInfo.dates.size * 48) + 2,
        "--rows": types.size,
      }'
      class='schedule__body'
      ref='body'
    >
      <div
        v-for='i in (scheduleInfo.dates.size * 24) - 1'
        class='schedule__col-line schedule__col-line--vertical'
        :style='{ "--offset": (i * 2) + 3 }'
        :key='i'
      />
      <div
        v-for='i in types.size'
        class='schedule__col-line schedule__col-line--horizontal'
        :style='{ "--offset": i + 2 }'
        :key='i'
      />
      <Typography
        :style='cssPosStyle({
          col: (i * 48) + 3,
          span: 48,
        })'
        class='schedule__col schedule__col--date'
        v-for='(date, i) in scheduleInfo.dates'
        color='dark-navy'
        type='heading4'
        :key='date'
        as='p'
      >
        {{ formatDate(date) }}
      </Typography>
      <div
        v-for='i in (scheduleInfo.dates.size * 24)'
        class='schedule__col schedule__col--time'
        :style='cssPosStyle({
          col: (i * 2) + 1,
          span: 2,
          row: 2,
        })'
        :key='i'
      >
        {{ displayHour(i) }}
      </div>
      <template
        v-for='([id, info], i) in types'
        :key='id'
      >
        <div
          class='schedule__col schedule__col--type'
          :style='{
            ...cssPosStyle({
              row: i + 3,
              span: 2,
            }),
            "--background-color": info.BackgroundColor,
            "--color": info.Color,
          }'
        >
          {{ info['Name'] }}
        </div>
          <div
            class='schedule__col schedule__col--event'
            v-for='event in scheduleInfo.byType[id]'
            :style='{
              ...getEventPosition(event, i + 3),
              "--background-color": getEventSpan(event) ? info.BackgroundColor : "transparent",
              "--color": info.Color,
            }'
            :key='event.id'
          >
          <button class='schedule__col-frame'>
            <div class='schedule__col-content'>
              <Typography
                class='schedule__text--truncated'
                color='dark-navy'
                type='small'
                as='p'
              >
                {{ event.get('Name') }}
              </Typography>
              <Typography
                class='schedule__info'
                color='disabled'
                type='xsmall'
                as='p'
              >
                <span class='schedule__text--truncated'>
                  {{ getHost(event) }}
                </span>
                <span class='schedule__info-platform'>
                  &nbsp;| {{ event.get('Platform') ?? 'N/A' }}
                </span>
              </Typography>
            </div>
          </button>
        </div>
      </template>
    </div>
    <div class='schedule__controls'>
      <Typography
        class='schedule__button'
        :disabled='!hasPrev'
        color='dark-navy'
        @click='prev'
        type='small'
        as='button'
      >
        <i class="fas fa-angle-left"/> Yesterday
      </Typography>
      <Typography
        class='schedule__button'
        :disabled='!hasNext'
        color='dark-navy'
        @click='next'
        type='small'
        as='button'
      >
        Tomorrow <i class="fas fa-angle-right"/>
      </Typography>
    </div>
  </div>
</template>

<script>
import Airtable from 'airtable';
import Color from 'color';
import Typography from '@/components/Typography';

function mapRecords(data, transform = v => v) {
 return data.reduce(
    (acc, field) => acc.set(field.id, transform(field.fields)),
    new Map(),
  );
}

export default {
  name: 'Calendar',
  components: {
    Typography,
  },
  data() {
    return {
      airtable: Airtable.base(process.env.VUE_APP_AIRTABLE_BASE),
      currentDate: new Date().toISOString().split('Z')[0],
      awaitDate: null,
      loading: true,
      events: null,
      hosts: null,
      types: null,
    };
  },
  async beforeMount() {
    await Promise.all([
      this.airtable.table('Events').select({
        sort: [{ field: 'Start' }],
      }).all().then(data => this.events = data),
      this.airtable.table('Hosts').select({
        fields: ['Name', 'Affiliation'],
      }).all().then(data => this.hosts = mapRecords(data)),
      this.airtable.table('Type of Events').select({
        fields: ['Name', 'Color'],
      }).all().then(data => this.types = mapRecords(data, this.transformType)),
    ]);

    const now = new Date(this.currentDate);
    const dates = [ ...this.scheduleInfo.dates ];
    this.currentDate = dates.find(
      date => date === this.currentDate || now < new Date(this.currentDate),
    ) ?? (now < new Date(dates[0]) ? dates[0] : dates.slice(-1));
    this.loading = false;
  },
  watch: {
    loading(val) {
      if (!val) {
        this.$nextTick(() => {
          this.$refs.body.addEventListener('scroll', this.onScroll, { passive: true });
        });
      }
    },
    awaitDate(val) {
      if (val !== null) {
        const idx = [ ...this.scheduleInfo.dates ].indexOf(val);
        const body = this.$refs.body;
        const elements = [ ...body.getElementsByClassName('schedule__col--date') ];
        body.scrollTo({
          left: elements[idx].offsetLeft - elements[0].offsetLeft + 1,
          behavior: 'smooth',
        });
      }
    }
  },
  beforeUnmount() {
    this.$refs.body?.removeEventListener('scroll', this.onScroll, { passive: true });
  },
  computed: {
    hasPrev() {
      return this.currentDate !== [ ...this.scheduleInfo.dates ][0];
    },
    hasNext() {
      return this.currentDate !== [ ...this.scheduleInfo.dates ].slice(-1)[0];
    },
    scheduleInfo() {
      if (!this.events || !this.hosts || !this.types) return {};
      const byType = Array.from(this.types.keys()).reduce((acc, type) => {
        acc[type] = [];
        return acc;
      }, {});
      const dates = new Set();

      // Sort events and infer info in a single loop for SPEED *Plays running in the 90s*
      this.events.forEach(event => {
        const type = event.get('Type of Event')?.[0];
        if (!type) return;

        const date = event.get('Start').split('T')[0];
        const serializedDate = `${date}T00:00:00`;
        if (!dates.has(serializedDate)) {
          dates.add(serializedDate);
        }

        byType[type].push(event);
      });

      return {
        byType,
        dates,
      };
    },
  },
  methods: {
    onScroll() {
      const body = this.$refs.body;
      const dateElements = [ ...body.getElementsByClassName('schedule__col--date') ];
      const offset = body.offsetLeft + body.scrollLeft + dateElements[0].offsetLeft;
      let dateIndex = [ ...dateElements ].findIndex(el => {
        return el.offsetLeft + el.offsetWidth >= offset;
      });
      if (dateIndex === -1) {
        dateIndex = 0;
      }

      const date = [ ...this.scheduleInfo.dates][dateIndex];
      if (this.awaitDate === null || this.awaitDate === date) {
        this.currentDate = [ ...this.scheduleInfo.dates][dateIndex];
        this.awaitDate = null;
      }
    },
    next() {
      if (this.awaitDate) return;
      const dates = [ ...this.scheduleInfo.dates ];
      const idx = dates.indexOf(this.currentDate);
      this.awaitDate = dates[idx + 1];
    },
    prev() {
      if (this.awaitDate) return;
      const dates = [ ...this.scheduleInfo.dates ];
      const idx = dates.indexOf(this.currentDate);
      this.awaitDate = dates[idx - 1];
    },
    formatDate(date) {
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }).format(new Date(date));
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
      }
    },
    getDatePosition(date) {
      const [ day, time ] = date.split('T');
      const dateIndex = [ ...this.scheduleInfo.dates ].indexOf(`${day}T00:00:00`);
      const [hour, minute] = time.split(':');

      return (dateIndex * 48) + (parseInt(hour) * 2) + (parseInt(minute) !== 0);
    },
    getEventSpan(event) {
      const start = event.get('Start');
      const end = event.get('End');
      return this.getDatePosition(end) - this.getDatePosition(start);
    },
    getEventPosition(event, row) {
      const start = event.get('Start');

      return this.cssPosStyle({
        col: this.getDatePosition(start) + 2,
        span: this.getEventSpan(event),
        row,
      });
    },
    displayHour(offset) {
      const period = (offset % 24) >= 12 ? 'pm' : 'am';
      const hour = (offset % 12) || 12;
      return `${hour}:00 ${period}`;
    },
    getHost(event) {
      return this.hosts.get(event.get('Host')?.[0])?.['Name'] ?? 'HT6';
    },
  },
}
</script>

<style lang="scss">
@use '@/styles/mixins';
@use '@/styles/colors';
@use '@/styles/units';

$_col-width: units.spacing(25);

.schedule {
  &__body {
    grid-template-columns: repeat(var(--columns), $_col-width);
    grid-template-rows: repeat(var(--rows), auto);
    overflow: auto;
    display: grid;
  }

  &__col {
    grid-column: var(--col) / span var(--span);
    box-sizing: border-box;
    grid-row: var(--row);

    &--date {
      border-left: 1px solid colors.css-color(light-teal, $alpha: 0.5);
      padding: 0 units.spacing(4) units.spacing(1);
    }

    &--time {
      border-left: 1px solid colors.css-color(light-teal, $alpha: 0.5);
      padding: 0 units.spacing(4) units.spacing(3);
    }

    &--type {
      border-right: 1px solid colors.css-color(light-teal, $alpha: 0.5);
      border-top: 1px solid colors.css-color(light-teal, $alpha: 0.5);
      background-color: colors.css-color(white);
      padding: units.spacing(6) units.spacing(2);
      align-items: center;
      position: sticky;
      display: flex;
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
  }

  &__col-line {
    background-color: colors.css-color(light-teal, $alpha: 0.5);
    &--vertical {
      grid-row: 3 / var(--rows) span;
      grid-column: var(--offset);
      height: 100%;
      width: 1px;
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
    padding: units.spacing(3) units.spacing(2);
    text-align: start;
    height: 100%;
    width: 100%;
  }

  &__col-content {
    max-width: $_col-width * 2;
    box-sizing: border-box;
  }

  &__info {
    display: flex;

    &-platform {
      flex-shrink: 0;
    }
  }

  &__text {
    &--truncated {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }

  &__controls {
    justify-content: space-between;
    padding-top: units.spacing(6);
    display: flex;
  }

  &__button {
    @include mixins.transition(background-color border-color color);
    border: 1px solid colors.css-color(dark-navy);
    padding: units.spacing(1) units.spacing(5);
    background-color: transparent;
    border-radius: 999px;
    cursor: pointer;

    &:disabled {
      background-color: colors.css-color(disabled, $alpha: 0.12);
      border-color: colors.css-color(disabled);
      color: colors.css-color(disabled);
      cursor: not-allowed;
    }

    &:hover:not(:disabled), &:focus:not(:disabled) {
      background-color: colors.css-color(dark-navy, $alpha: 0.06);
    }

    &:active:not(:disabled) {
      background-color: colors.css-color(dark-navy, $alpha: 0.12);
    }
  }
}
</style>