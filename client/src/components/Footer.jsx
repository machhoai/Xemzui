
import React from 'react';
import { FaFacebookF, FaYoutube, FaTwitter, FaInstagram } from 'react-icons/fa';
import vnflag from '../assets/images/vn_flag.svg'; // Ensure the path is correct
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-[#0F111A] text-white py-10 text-sm">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col items-start">
                    <div className="mb-4 flex items-center gap-2 bg-[#78140f] px-3 py-2.5 rounded-3xl shadow-inner">
                        <img src={vnflag} alt="Vietnam Flag" className="w-5 h-5" />
                        <span className="text-white-500 font-semibold text-sm">Hoàng Sa & Trường Sa là của Việt Nam!</span>
                    </div>
                    <div className="mb-6 flex flex-col sm:flex-row items-start gap-4 w-full ">
                        <a href="/phimhay" className="flex items-center gap-2">
                            <div className="text-left leading-tight">
                                <span className="text-4xl font-semibold">XemZui</span><br />
                                <span className="text-xl text-gray-300">Cười rụng rổ</span>
                            </div>
                        </a>
                        <div className="flex gap-4 flex-wrap items-center ml-10 sm:mt-3">
                            <a href="https://facebook.com" className="w-10 h-10 flex items-center justify-center rounded-full bg-[#282B3A] dark:bg-white text-blue-600 hover:bg-blue-600 hover:text-white transition" aria-label="Facebook">
                                <FaFacebookF />
                            </a>
                            <a href="https://youtube.com" className="w-10 h-10 flex items-center justify-center rounded-full bg-[#282B3A] dark:bg-white text-red-600 hover:bg-red-600 hover:text-white transition" aria-label="YouTube">
                                <FaYoutube />
                            </a>
                            <a href="https://twitter.com" className="w-10 h-10 flex items-center justify-center rounded-full bg-[#282B3A] dark:bg-white text-blue-400 hover:bg-blue-400 hover:text-white transition" aria-label="Twitter">
                                <FaTwitter />
                            </a>
                            <a href="https://instagram.com" className="w-10 h-10 flex items-center justify-center rounded-full bg-[#282B3A] dark:bg-white text-pink-500 hover:bg-pink-500 hover:text-white transition" aria-label="Instagram">
                                <FaInstagram />
                            </a>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-gray-300 mb-4">
                        <a href="/hoi-dap" className="hover:text-white">Hỏi-Đáp</a>
                        <a href="/chinh-sach-bao-mat" className="hover:text-white">Chính sách bảo mật</a>
                        <a href="/dieu-khoan-su-dung" className="hover:text-white">Điều khoản sử dụng</a>
                        <a href="/gioi-thieu" className="hover:text-white">Giới thiệu</a>
                        <a href="/lien-he" className="hover:text-white">Liên hệ</a>
                    </div>

                    <div className="flex flex-wrap gap-4 text-gray-300 mb-4">
                        <a href="/dongphim" className="hover:text-white">Dongphim</a>
                        <a href="/ghienphim" className="hover:text-white">Ghienphim</a>
                        <a href="/motphim" className="hover:text-white">Motphim</a>
                        <a href="/subnhanh" className="hover:text-white">Subnhanh</a>
                    </div>

                    <p className="text-gray-400 max-w-4xl leading-relaxed text-left">
                        XemZui – Cười rụng rổ - Trang xem phim online chất lượng cao miễn phí Vietsub, thuyết minh, lồng tiếng full HD. Kho phim mới khổng lồ, phim chiếu rạp, phim bộ, phim lẻ từ nhiều quốc gia như Việt Nam, Hàn Quốc, Trung Quốc, Thái Lan, Nhật Bản, Âu Mỹ… đa dạng thể loại. Khám phá nền tảng phim trực tuyến hay nhất 2024 chất lượng 4K!
                    </p>
                    <div className="text-gray-500 mt-4">© 2024 XemZui</div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
