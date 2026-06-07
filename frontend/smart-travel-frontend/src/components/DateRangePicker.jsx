import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import './DateRangePicker.css';


const MONTH_LABEL_COLOR = '#a5b4fc';

function pad2(n) {
  return String(n).padStart(2, '0');
}

function toISODateLocal(d) {
  // d is a Date in local time
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function parseISODateLocal(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map((x) => Number(x));
  return new Date(y, m - 1, d);
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function daysInMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function addMonths(date, delta) {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

function areSameDay(a, b) {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isBeforeDay(a, b) {
  // a < b by calendar day
  if (!a || !b) return false;
  const aa = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const bb = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return aa < bb;
}

function isAfterOrSameDay(a, b) {
  if (!a || !b) return false;
  const aa = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const bb = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return aa >= bb;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onChange,
  disabledBeforeToday = true,
}) {
  const wrapperRef = useRef(null);
  const [open, setOpen] = useState(false);

  const today = useMemo(() => new Date(), []);
  const todayDay = useMemo(
    () => new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    [today]
  );

  const start = useMemo(() => parseISODateLocal(startDate), [startDate]);
  const end = useMemo(() => parseISODateLocal(endDate), [endDate]);

  const [monthCursor, setMonthCursor] = useState(() => {
    const base = start || end || todayDay;
    return startOfMonth(base);
  });

  useEffect(() => {
    const base = start || end || todayDay;
    setMonthCursor(startOfMonth(base));
  }, [startDate, endDate]);

  useEffect(() => {
    function onDocMouseDown(e) {
      if (!open) return;
      if (!wrapperRef.current) return;
      if (wrapperRef.current.contains(e.target)) return;
      setOpen(false);
    }

    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, [open]);

  const labelText = useMemo(() => {
    if (start && end) return `${toISODateLocal(start)} → ${toISODateLocal(end)}`;
    if (start) return `${toISODateLocal(start)} →`;
    return 'Select dates';
  }, [start, end]);

  const monthLabel = useMemo(() => {
    const month = monthCursor.toLocaleString(undefined, { month: 'long' });
    return `${month} ${monthCursor.getFullYear()}`;
  }, [monthCursor]);

  const gridDates = useMemo(() => {
    // 7-column grid; show full weeks (Sun..Sat)
    const first = startOfMonth(monthCursor);
    const firstDow = first.getDay(); // 0..6

    const totalCells = 42; // 6 weeks grid
    const startCell = new Date(first);
    startCell.setDate(first.getDate() - firstDow);

    return Array.from({ length: totalCells }, (_, i) => {
      const d = new Date(startCell);
      d.setDate(startCell.getDate() + i);
      const inMonth = d.getMonth() === monthCursor.getMonth();
      const selectable = inMonth && (!disabledBeforeToday || isAfterOrSameDay(d, todayDay));
      return { date: d, inMonth, selectable };
    });
  }, [monthCursor, disabledBeforeToday, todayDay]);

  const nightsCount = useMemo(() => {
    if (!start || !end) return null;
    const ms = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime() -
      new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
    const nights = Math.round(ms / (1000 * 60 * 60 * 24));
    return nights >= 1 ? nights : 0;
  }, [start, end]);

  const handleSelectDate = (d) => {
    if (!d) return;
    if (disabledBeforeToday && isBeforeDay(d, todayDay)) return;

    // Typical: allow reselect start after both are chosen.
    if (!start || (start && end)) {
      // if end exists, reset range
      onChange({ startDate: toISODateLocal(d), endDate: '' });
      return;
    }

    // start exists, end not set
    if (isBeforeDay(d, start)) {
      // clicking earlier than start -> treat as new start
      onChange({ startDate: toISODateLocal(d), endDate: '' });
      return;
    }

    onChange({ startDate: toISODateLocal(start), endDate: toISODateLocal(d) });
  };

  const getCellClass = (dObj) => {
    const d = dObj.date;
    const isToday = areSameDay(d, todayDay);
    const isStart = start && areSameDay(d, start);
    const isEnd = end && areSameDay(d, end);

    const inRange =
      start && end &&
      !isStart &&
      !isEnd &&
      isAfterOrSameDay(d, start) &&
      isAfterOrSameDay(end, d); // d between

    return {
      isToday,
      isStart,
      isEnd,
      inRange,
      selectable: dObj.selectable,
      overflow: !dObj.inMonth,
    };
  };

  return (
    <div ref={wrapperRef} className="drp-wrapper">
      <button
        type="button"
        className={"drp-trigger" + (open ? ' is-open' : '')}
        onClick={() => setOpen((v) => !v)}
      >
        <div className="drp-trigger-left">
          <Calendar size={15} color="#a5b4fc" />
          <span className={start ? 'drp-trigger-text filled' : 'drp-trigger-text'}>{labelText}</span>
        </div>
      </button>

      {open && (
        <div className="drp-popup" role="dialog" aria-label="Select date range">
          <div className="drp-header">
            <div className="drp-header-label">{monthLabel}</div>
            <div className="drp-nav">
              <button
                type="button"
                className="drp-nav-btn"
                aria-label="Previous month"
                onClick={() => setMonthCursor((m) => addMonths(m, -1))}
              >
                <ChevronLeft size={16} color={MONTH_LABEL_COLOR} />
              </button>
              <button
                type="button"
                className="drp-nav-btn"
                aria-label="Next month"
                onClick={() => setMonthCursor((m) => addMonths(m, 1))}
              >
                <ChevronRight size={16} color={MONTH_LABEL_COLOR} />
              </button>
            </div>
          </div>

          <div className="drp-dow">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((x) => (
              <div key={x}>{x}</div>
            ))}
          </div>

          <div className="drp-grid">
            {gridDates.map((dObj, idx) => {
              const cell = getCellClass(dObj);
              const dateISO = toISODateLocal(dObj.date);

              let className = 'drp-cell';
              if (!dObj.inMonth) className += ' is-overflow';
              if (!dObj.selectable) className += ' is-disabled';
              if (cell.inRange) className += ' is-in-range';
              if (cell.isStart) className += ' is-start';
              if (cell.isEnd) className += ' is-end';
              if (cell.isToday) className += ' is-today';

              const disabled = !dObj.selectable || !dObj.inMonth;

              return (
                <button
                  key={idx}
                  type="button"
                  className={className}
                  disabled={disabled}
                  onClick={() => handleSelectDate(dObj.date)}
                  aria-label={dateISO}
                >
                  {dObj.date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="drp-footer">
            <div className="drp-footer-side">
              <div className="drp-footer-title">Check-in</div>
              <div className={start ? 'drp-footer-value filled' : 'drp-footer-value'}>
                {start ? toISODateLocal(start) : '—'}
              </div>
            </div>

            <div className="drp-night">
              {start && end ? (
                <span>{nightsCount} night{nightsCount === 1 ? '' : 's'}</span>
              ) : null}
            </div>

            <div className="drp-footer-side right">
              <div className="drp-footer-title">Check-out</div>
              <div className={end ? 'drp-footer-value filled' : 'drp-footer-value'}>
                {end ? toISODateLocal(end) : '—'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

