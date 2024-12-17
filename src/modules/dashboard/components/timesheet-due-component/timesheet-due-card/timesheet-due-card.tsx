"use client";
import React, { useState, useEffect } from "react";
import styles from "./timesheet-due-card.module.scss";
import CardSection from "../../card-section/card-section";
import Timesheet from "../timesheet-due/timesheet-due";
import ButtonComponent from "@/themes/components/button/button";
import SkeletonLoader from "@/themes/components/skeleton-loader/skeleton-loader";
import TimeDueModal from "../../submit-timesheet-modal/submit-timesheet-modal";
import UseDashboardServices, {
  DatePickerData,
  DatePickerResponse,
  TimesheetDue,
  TimesheetDueResponse,
} from "@/modules/dashboard/services/dashboard-services/dashboard-services";
import DateRangePicker from "@/themes/components/date-picker/date-picker";

const TimeSheetDueCard: React.FC = () => {
  const [timesheetDueData, setTimesheetDueData] = useState<TimesheetDue[] | []>(
    []
  );
  const [selectedStartDate, setSelectedStartDate] = useState<string>("");
  const [selectedEndDate, setSelectedEndDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [totalTime, setTotalTime] = useState<string>("0");
  const [datePickerData, setDatePickerData] = useState<DatePickerData[]>([]);

  const handleClickReview = () => {
    window.location.href = "/time-sheet";
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true before fetching
      setError(null); // Clear any previous errors
      try {
        const data: TimesheetDueResponse =
          await UseDashboardServices().fetchTimesheetDueData(
            selectedStartDate,
            selectedEndDate
          );
        setTimesheetDueData(data.data);

        // Calculate the total time (hours) based on the new data
        const totalHours =
          data?.data?.find((item: any) => item.date === "TOTAL")?.hours ??
          "00:00";

        setTotalTime(totalHours); // Update totalTime state with the fetched data
      } catch (error) {
        setError("Error fetching timesheet data.");
      } finally {
        setLoading(false); // Set loading to false after data fetch
      }
    };

    fetchData();
  }, [selectedStartDate, selectedEndDate]);

  useEffect(() => {
    const fetchDatePicker = async () => {
      try {
        const datePickerResponse: DatePickerResponse =
          await UseDashboardServices().fetchDatePickerData();
        setDatePickerData(datePickerResponse.data);
      } catch (error) {
        console.error("Error fetching date picker data:", error);
      }
    };
    fetchDatePicker();
  }, []);
  // Handle the date change from the DateRangePicker

  const handleSubmitClick = () => {
    setIsModalVisible(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleDateChange = (startDate: string, endDate: string) => {
    setSelectedStartDate(startDate);
    setSelectedEndDate(endDate);
  };

  if (error) return <div>{error}</div>;

  return (
    <>
      <CardSection
        title="Timesheet due"
        topRightContent={
          <div>
            <DateRangePicker
              weekData={datePickerData}
              onDateChange={handleDateChange}
              dateChangeType="pastDue"
            />
          </div>
        }
        centerContent={
          loading ? (
            <SkeletonLoader
              count={8}
              paragraph={{ rows: 3 }}
              className={styles.customSkeleton}
              classNameItem={styles.skeletonItem}
            />
          ) : (
            <Timesheet data={timesheetDueData} />
          )
        }
        bottomContent={
          loading ? (
            <SkeletonLoader
              count={2}
              button={true}
              className={styles.customSkeletonForButton}
            />
          ) : (
            <div>
              <ButtonComponent
                label="Review"
                theme="white"
                onClick={handleClickReview}
              />
              <ButtonComponent
                label="Submit"
                theme="black"
                onClick={handleSubmitClick}
              />
            </div>
          )
        }
        className={styles.timesheetCard}
      />

      {isModalVisible && (
        <TimeDueModal onClose={handleCloseModal} totalTime={totalTime} />
      )}
    </>
  );
};

export default TimeSheetDueCard;
