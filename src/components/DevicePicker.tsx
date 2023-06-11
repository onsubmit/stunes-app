import { useQuery } from '@tanstack/react-query';
import Select, { ActionMeta, StylesConfig, Theme } from 'react-select';
import { Err, Ok, Result } from 'ts-results';

import { getOrRefreshAccessTokenAsync } from '../utils/getOrRefreshAccessTokenAsync';
import { AvailableDevice, getAvailableDevicesAsync, transferPlaybackAsync } from '../utils/spotifyWebApi/player';
import { className, selectClass, statusClass } from './DevicePicker.css';

type SelectOption = { value: string | null; label: string };

function DevicePicker() {
  const queryKey = 'getAvailableDevices';
  const {
    isLoading,
    error,
    data: availableDevicesResult,
  } = useQuery({
    queryKey: [queryKey],
    retry: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,

    queryFn: async () => {
      const devicesResult = await getMyAvailableDevicesAsync();
      if (!devicesResult.ok) {
        return Ok.EMPTY;
      }

      return new Ok(devicesResult.val);
    },
  });

  async function getMyAvailableDevicesAsync(): Promise<Result<AvailableDevice[], void>> {
    const result = await getOrRefreshAccessTokenAsync();
    if (!result.ok) {
      return Err.EMPTY;
    }

    const { accessToken, refreshToken } = result.val;
    return await getAvailableDevicesAsync(accessToken, refreshToken);
  }

  const selectTheme = (theme: Theme) => ({
    ...theme,
    borderRadius: 0,
    spacing: {
      ...theme.spacing,
      baseUnit: 6,
    },
    colors: {
      ...theme.colors,
      neutral0: '#121212', // Background
      neutral50: '#fff', // Foreground
      neutral80: '#fff', // Placeholder
      primary: '#1ED760', // Selected
      primary25: '#333', // Hover
      primary50: '#444', // Active
    },
  });

  const selectStyles: StylesConfig = {
    control: (baseStyles, _state) => ({
      ...baseStyles,
      borderRadius: '6px',
    }),
  };

  async function onChangeAsync(newValue: unknown, _actionMeta: ActionMeta<unknown>) {
    const selectedOption = newValue as SelectOption;
    const deviceId = selectedOption.value;

    if (!deviceId) {
      return;
    }

    const result = await getOrRefreshAccessTokenAsync();
    if (!result.ok) {
      return Err.EMPTY;
    }

    const { accessToken, refreshToken } = result.val;
    await transferPlaybackAsync(accessToken, refreshToken, [deviceId]);
  }

  function getElement(): JSX.Element {
    if (isLoading) {
      return <Select className={selectClass} isLoading={true} placeholder="Loading devices..." theme={selectTheme} />;
    }

    if (error || availableDevicesResult?.err) {
      return <div className={statusClass}>An error occurred getting your devices. Please try again.</div>;
    }

    if (availableDevicesResult?.ok) {
      if (availableDevicesResult.val) {
        const devices = availableDevicesResult.val
          .filter((device) => !device.isRestricted)
          .sort((a, b) => {
            const lowerA = a.name.toLocaleLowerCase();
            const lowerB = b.name.toLocaleLowerCase();
            if (lowerA < lowerB) {
              return -1;
            }

            if (lowerA > lowerB) {
              return 1;
            }

            return 0;
          });

        if (!devices[0]) {
          return <div className={statusClass}>No devices found</div>;
        }

        //const defaultValue = devices.find((device) => device.isActive) || devices[0];

        let defaultValue: SelectOption | undefined;
        const options: SelectOption[] = [];
        for (const device of devices) {
          if (device.isRestricted) {
            continue;
          }

          const option = { value: device.id, label: device.name };
          if (device.isActive) {
            defaultValue = option;
          }

          options.push(option);
        }
        return (
          <Select
            options={options}
            className={selectClass}
            value={defaultValue}
            placeholder="Select device"
            theme={selectTheme}
            styles={selectStyles}
            onChange={onChangeAsync}
          />
        );
      }
    }

    return <div className={statusClass}>No devices found</div>;
  }

  return <div className={className}>{getElement()}</div>;
}

export default DevicePicker;
