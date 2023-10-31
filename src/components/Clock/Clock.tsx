import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import OriginalClock from 'react-clock'
import { Spinner } from '../Spinner/Spinner'

type FetchError = null | { message: string }

const useClock = () => {
  const [error, setError] = useState<FetchError>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [time, setTime] = useState<Date | string>('')
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    console.log(event)
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const tooltipOffset = 30;
    setTooltipPosition({ top: event.clientY - tooltipOffset, left: event.clientX + 10 });
  };

  const CURRENT_TIME_URL = 'https://worldtimeapi.org/api/timezone/Europe/Berlin'

  const fetchCurrentTime = () =>
    fetch(CURRENT_TIME_URL)
      .then((response) => response.json())
      .then((body) => {
        setTime(new Date(body.datetime))
      })
      .catch((err) => {
        console.warn(`Failed to get time ${err}`)
        setError(err)
      })
      .finally(() => setIsLoading(false))

  useEffect(() => {
    const interval = setInterval(fetchCurrentTime, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  return React.useMemo(
    () => ({
      error,
      isLoading,
      time,
      tooltipPosition,
      showTooltip,
      handleMouseEnter,
      handleMouseLeave,
      handleMouseMove
    }),
    [error, isLoading, time, tooltipPosition, showTooltip, handleMouseEnter, handleMouseLeave, handleMouseMove]
  )
}

export const Clock = () => {
  const { error, isLoading, time, tooltipPosition, showTooltip, handleMouseEnter, handleMouseLeave, handleMouseMove } = useClock()

  return (
    <div className={styles.clock} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onMouseMove={handleMouseMove}>
      {error && <div>Error: {error?.message}</div>}
      {isLoading ? <Spinner /> : <OriginalClock value={time} className={styles.time}/>}
      {showTooltip && (
        <div className={styles.tooltip} style={{ top: tooltipPosition.top, left: tooltipPosition.left }}>
          {time.toLocaleString()}
        </div>
      )}
    </div>
  )
}
