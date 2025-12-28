
import { Subject } from "./types";

export const PROVINCES = [
  "An Giang",
  "Bắc Giang",
  "Cao Bằng",
  "Cà Mau",
  "Cần Thơ",
  "Đà Nẵng",
  "Đắk Lắk",
  "Điện Biên",
  "Đồng Nai",
  "Gia Lai",
  "Hà Nội",
  "Hà Tĩnh",
  "Hải Phòng",
  "Hồ Chí Minh",
  "Huế",
  "Khánh Hòa",
  "Lào Cai",
  "Lâm Đồng",
  "Lạng Sơn",
  "Nghệ An",
  "Ninh Bình",
  "Phú Thọ",
  "Quảng Ngãi",
  "Quảng Ninh",
  "Quảng Trị",
  "Sơn La",
  "Tây Ninh",
  "Thái Nguyên",
  "Thanh Hóa",
  "Tuyên Quang",
  "Vĩnh Long"
].sort((a, b) => a.localeCompare(b));

export const SUBJECTS_LIST = [
  Subject.MATH, Subject.LIT, Subject.ENG, Subject.NAT_SCI, Subject.HIS_GEO,
  Subject.IT, Subject.TECH, Subject.CIVIC, Subject.LOCAL
];

export const GRADES = ["Khối 6", "Khối 7", "Khối 8", "Khối 9"];
