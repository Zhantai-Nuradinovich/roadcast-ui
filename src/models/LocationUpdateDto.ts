export interface LocationUpdateDto {
  userId?: string;
  anonId?: string;
  latitude: number;
  longitude: number;
  speed?: number;
  heading?: number;
  timestamp?: string;
}
