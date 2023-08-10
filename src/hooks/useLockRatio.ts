import { useState } from "react";

export type Size = {
  w: number | null;
  h: number | null;
  unit: string | null;
};

export type LockedRatioStatus =
  | {
      active: false;
      ratio: null;
    }
  | {
      active: boolean;
      /** width / height */
      ratio: number | null;
    };

export interface OnChange {
  (value: string, type: keyof Size): void;
}

/** 同时输入宽与高（还有锁住宽高比功能的）的hooks */
const useLockRatio = () => {
  const [inputedSize, setInputedSize] = useState<Size>({
    w: null,
    h: null,
    unit: null,
  });
  const [lockedRatioStatus, setLockedRatioStatus] = useState<LockedRatioStatus>(
    {
      active: false,
      ratio: null,
    }
  );

  const cleanInputedSize = () =>
    setInputedSize({ w: null, h: null, unit: null });

  const onChangeWidthOrHeight = (
    v: number | null,
    type: Exclude<keyof Size, "unit">
  ) => {
    if (lockedRatioStatus.active) {
      const otherType = (["w", "h"] as const).filter((t) => t !== type)[0];
      setInputedSize(
        (old) =>
          ({
            ...old,
            [type]: v,
            [otherType]: lockedRatioStatus.ratio
              ? v === null
                ? null
                : v / lockedRatioStatus.ratio
              : v,
          } as Size)
      );
    } else {
      setInputedSize((o) => ({ ...o, [type]: v }));
    }
  };

  const onChange: OnChange = (value, type) => {
    if (type === "unit") {
      setInputedSize((o) => ({ ...o, unit: value }));
      return;
    }
    if (value === "") {
      onChangeWidthOrHeight(null, type);
    } else if (isNaN(+value)) {
      return;
    } else {
      onChangeWidthOrHeight(+value, type);
    }
  };

  const lock = () =>
    setLockedRatioStatus({
      active: true,
      // 用户填写的宽高不全时, 1:1
      ratio:
        !inputedSize.w || !inputedSize.h ? 1 : inputedSize.w / inputedSize.h,
    });

  const unlock = () => setLockedRatioStatus({ active: false, ratio: null });

  return {
    /** 用户填写的宽高 */
    inputedSize,
    dangerouslySetInputedSize: setInputedSize,
    cleanInputedSize,
    onChange,
    lockedRatioStatus,
    lock,
    unlock,
  } as const;
};

export default useLockRatio;
