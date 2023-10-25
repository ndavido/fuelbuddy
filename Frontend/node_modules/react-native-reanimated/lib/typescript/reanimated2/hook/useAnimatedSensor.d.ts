import type { SensorConfig, AnimatedSensor, Value3D, ValueRotation } from '../commonTypes';
import { SensorType } from '../commonTypes';
export declare function useAnimatedSensor(sensorType: SensorType.ROTATION, userConfig?: Partial<SensorConfig>): AnimatedSensor<ValueRotation>;
export declare function useAnimatedSensor(sensorType: Exclude<SensorType, SensorType.ROTATION>, userConfig?: Partial<SensorConfig>): AnimatedSensor<Value3D>;
