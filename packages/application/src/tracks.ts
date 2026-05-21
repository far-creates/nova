import { getTracks } from '@/packages/db/src';

export async function getTrackLibrary() {
  return getTracks();
}
