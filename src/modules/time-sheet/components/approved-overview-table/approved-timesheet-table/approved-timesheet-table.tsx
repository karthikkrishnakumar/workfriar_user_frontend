"use client";

import React, { ReactNode, useState, useEffect, useRef } from "react";
import CustomTable from "@/themes/components/custom-table/custom-table";
import styles from "./approved-timesheet-table.module.scss";
import TimeInput from "@/themes/components/time-input/time-input";
import Icons from "@/themes/images/icons/icons";
import TextAreaButton from "../../text-area-button/text-area-button";
import ButtonComponent from "@/themes/components/button/button";
import {
  TimeEntry,
  TimesheetDataTable,
  WeekDaysData,
} from "../../../services/time-sheet-services";
import {
  minutesToTime,
  timeToMinutes,
} from "@/utils/timesheet-utils/timesheet-time-formatter";

interface PastDueTableProps {
  timesheetData?: TimesheetDataTable[];
  setTimeSheetData: (data: TimesheetDataTable[]) => void;
  daysOfWeek: WeekDaysData[];
  backButtonFunction: () => void;
}

const ApprovedTimesheetsTable: React.FC<PastDueTableProps> = ({
  timesheetData: initialTimesheetData = [],
  setTimeSheetData,
  daysOfWeek,
  backButtonFunction

}) => {
  const [timesheetData, setLocalTimesheetData] =
    useState<TimesheetDataTable[]>(initialTimesheetData);
  const [showTaskDetailModal, setTaskDetailModal] = useState<boolean>(false);
  const textAreaOnclick = (rowIndex: number) => {
    setEditingRowIndex(rowIndex);
    setTaskDetailModal(!showTaskDetailModal);
  };
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);



  // Calculate total hours for a row
  const calculateTotalHours = (entries: TimeEntry[]) => {
    const totalMinutes = entries.reduce(
      (total, entry) => total + timeToMinutes(entry.hours || "00:00"),
      0
    );
    return minutesToTime(totalMinutes);
  };

  // Map time entries to corresponding week days
  const mapTimeEntriesToWeek = (
    entries: TimeEntry[],
    index: number
  ): Record<string, ReactNode> => {
    const weekMap: Record<string, ReactNode> = {};
    daysOfWeek.forEach((day, dayIndex) => {
      const entry = entries[dayIndex] || {
        hours: "00:00",
        isHoliday: false,
        date: "",
      };
      weekMap[day.name] = (
        <TimeInput
          value={entry.hours}
          disabled={entry.isDisabled}
          tooltipContent={
            entry.isDisabled ? "These dates are in next week" : ""
          }
          readOnly={true}
        />
      );
    });
    return weekMap;
  };



  // Save button functionality
  

  // Submit button functionality
  const handleSubmit = () => {

    alert("Timesheet data submitted successfully!");
  };

  // Calculate total hours by day
  const calculateTotalByDay = () => {
    const dailyTotals: Record<string, number> = {};
    daysOfWeek.forEach((day) => {
      dailyTotals[day.name] = timesheetData.reduce((total, timesheet) => {
        const dayIndex = daysOfWeek.indexOf(day);
        const dayEntry = timesheet.dataSheet[dayIndex];
        return total + timeToMinutes(dayEntry?.hours || "00:00");
      }, 0);
    });

    return dailyTotals;
  };

  // Total row component
  const totalRow = () => {
    const dailyTotals = calculateTotalByDay();
    const totalAllDays = Object.values(dailyTotals).reduce((a, b) => a + b, 0);

    return {
      task: <span className={styles.totalRowTask}>Total</span>,
      details: <span></span>,
      ...Object.fromEntries(
        daysOfWeek.map((day) => [
          day.name,
          <span>{minutesToTime(dailyTotals[day.name])}</span>,
        ])
      ),
      total: (
        <span className={styles.rowWiseTotal}>
          <p>{minutesToTime(totalAllDays)}</p>
        </span>
      ),
      action: <span></span>,
      flag: "rowOfTotal",
    };
  };

  // Columns and final data
  const columns = [
    { title: "Task", key: "task", width: 140 },
    {
      title: <span style={{ width: "100px" }}>Task Details</span>,
      key: "details",
      width: 155,
    },
    ...daysOfWeek.map((day) => ({
      title: (
        <span
          className={
            day.isHoliday
              ? `${styles.dateTitles} ${styles.holidayDateTitles}` // Apply holiday style
              : styles.dateTitles // Default style
          }
        >
          <p>{day.name}</p>
          <p>{day.formattedDate}</p>
        </span>
      ),
      key: day.name,
    })),
    { title: "Total", key: "total", width: 70 },
  ];

  const data = timesheetData.map((timesheet, index) => {
    const totalHours = calculateTotalHours(timesheet.dataSheet);
    const taskStatusClass =
      timesheet.status === "approved"
        ? styles.approved
        : timesheet.status === "rejected"
        ? styles.rejected
        : "";

    return {
      task: (
        <div className={`${styles.tableDataCell} ${taskStatusClass}`}>
          <span className={styles.taskName}>{timesheet.categoryName}</span>
          <span className={styles.projectName}>{timesheet.projectName}</span>
        </div>
      ),
      details: (
        <TextAreaButton
          buttonvalue={timesheet.taskDetail}
          onclickFunction={() => textAreaOnclick(index)}
          showTaskDetailModal={editingRowIndex === index && showTaskDetailModal}
          value={timesheetData[index].taskDetail}
          setvalue={(newValue) => {
            const updatedData = [...timesheetData];
            updatedData[index].taskDetail = newValue;
            setLocalTimesheetData(updatedData);
            setTimeSheetData(updatedData);
          }}
          readOnly={true}
        />
      ),
      ...mapTimeEntriesToWeek(timesheet.dataSheet, index),
      total: (
        <span className={styles.rowWiseTotal}>
          <p>{totalHours}</p>
        </span>
      ),
    };
  });

  return (
    <div className={styles.mainContainer}>
      <div className={styles.scrollContainer}>
        <div className={styles.tableWrapper}>
          <CustomTable
            columns={columns}
            data={[...data, totalRow()]}
          />
        </div>
      </div>
      <div className={styles.actionButtons}>
        <span className={styles.backButton} onClick={backButtonFunction}> {"< Back"}</span>
      </div>
    </div>
  );
};

export default ApprovedTimesheetsTable;
