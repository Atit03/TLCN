import React from "react";
import AboutHeader from "../assets/page-header/about-header.jpg";
import { FaHandsHelping, FaEye, FaUsers } from "react-icons/fa";

const About = () => {
  return (
    <section className="h-auto pt-2 min-h-[80vh] bg-gray-100">
      <div className="max-w-xl sm:max-w-4xl lg:max-w-7xl relative px-5 pt-20 pb-12 items-center mx-auto lg:mx-20 xl:mx-28 2xl:mx-40 3xl:mx-auto lg:pb-2 lg:px-1 xl:px-3 2xl:px-1">

        <h2 className="product capitalize text-white font-bold text-center relative z-10 lg:text-left text-3xl sm:text-4xl sm:leading-none pb-3 px-8">
          Về chúng tôi
        </h2>

        <div className="absolute top-0 left-0 bg-dark-grayish-blue w-full h-48 rounded-md overflow-hidden">
          <img
            src={AboutHeader}
            alt="rows of sneakers"
            className="opacity-10 absolute h-full w-full object-cover"
          />
        </div>

        <div className="bg-white relative z-20 rounded-md shadow-lg p-8 mt-16 space-y-8">

          <div className="flex flex-col items-center lg:flex-row lg:items-start">
            <FaEye className="text-blue-500 text-4xl mb-4 lg:mr-6 lg:mb-0" />
            <div>
              <h3 className="text-xl font-semibold text-dark-grayish-blue mb-2">Tầm nhìn của chúng tôi</h3>
              <p className="text-gray-700 leading-relaxed">
                Tầm nhìn của chúng tôi là tạo ra một môi trường mua sắm trực tuyến an toàn, tiện lợi và đáng tin cậy, giúp người dùng có thể dễ dàng tìm kiếm và sở hữu những sản phẩm tốt nhất.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center lg:flex-row lg:items-start">
            <FaHandsHelping className="text-green-500 text-4xl mb-4 lg:mr-6 lg:mb-0" />
            <div>
              <h3 className="text-xl font-semibold text-dark-grayish-blue mb-2">Sứ mệnh của chúng tôi</h3>
              <p className="text-gray-700 leading-relaxed">
                Chúng tôi cam kết đem lại trải nghiệm tốt nhất cho khách hàng qua dịch vụ chuyên nghiệp và tận tâm. Đội ngũ của chúng tôi không ngừng học hỏi, đổi mới và áp dụng những công nghệ tiên tiến để cải tiến dịch vụ.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center lg:flex-row lg:items-start">
            <FaUsers className="text-yellow-500 text-4xl mb-4 lg:mr-6 lg:mb-0" />
            <div>
              <h3 className="text-xl font-semibold text-dark-grayish-blue mb-2">Đội ngũ của chúng tôi</h3>
              <p className="text-gray-700 leading-relaxed">
                Đội ngũ của chúng tôi luôn lắng nghe và đón nhận mọi ý kiến đóng góp từ người dùng để hoàn thiện và phát triển. Chúng tôi tự hào về đội ngũ nhân viên chuyên nghiệp và tận tâm.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
