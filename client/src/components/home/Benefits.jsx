import React from "react";
import star from "../../assets/star.svg";
import truck from "../../assets/truck-fast.svg";
import hand from "../../assets/hand-holding-dollar.svg";

const Benefits = () => {
  return (
    <section className="lg:mx-20 xl:mx-28 2xl:mx-36  3xl:mx-auto lg:px-0 xl:px-3 max-w-xl mx-auto lg:max-w-7xl mb-12 lg:mb-16 lg:mt-7">
      <h2 className="text-very-dark-blue font-bold w-fit border-t text-2xl text-center mx-auto lg:mx-0 lg:text-left sm:text-4xl sm:leading-none py-6 sm:pb-5 mb-6 lg:mb-9">
        Lợi ích
      </h2>
      <div
        id="benefits"
        className="flex flex-col lg:flex-row items-center justify-center"
      >
        <div className="detail px-4 mb-10 flex flex-col items-center text-center lg:text-left lg:items-start">
          <figure className="bg-pale-orange rounded-full w-12 h-12 flex flex-col lg:flex-row items-center justify-center">
            <img src={truck} alt="truck" className="w-7" />
          </figure>
          <h3 className="text-very-dark-blue font-bold text-xl pt-5 pb-4">
            Giao hàng nhanh
          </h3>
          <p className="text-grayish-blue text-base">
            Chúng tôi kết hợp với các công ty vận chuyển uy tín để mang cho bạn sản phẩm với thời gian nhanh nhất và chi phí vô cùng tiết kiệm.
          </p>
        </div>
        <div className="detail px-4 mb-10 flex flex-col items-center text-center lg:text-left lg:items-start">
          <figure className="bg-pale-orange rounded-full w-12 h-12 flex items-center justify-center">
            <img src={hand} alt="hand holding dollar" className="w-7 mb-1" />
          </figure>
          <h3 className="text-very-dark-blue font-bold text-xl pt-5 pb-4">
            Giá cả phải chăng
          </h3>
          <p className="text-grayish-blue text-base">
          Những đôi giày thể thao có sẵn chỉ nằm trong tầm tay của bạn. 
          Không có chi phí ẩn. Không có phí bổ sung được yêu cầu ngoài những gì đã nêu.
          </p>
        </div>
        <div className="detail px-4 mb-10 flex flex-col items-center text-center lg:text-left lg:items-start">
          <figure className="bg-pale-orange rounded-full w-12 h-12 flex items-center justify-center">
            <img src={star} alt="star icon" className="w-7" />
          </figure>
          <h3 className="text-very-dark-blue font-bold text-xl pt-5 pb-4">
            Chất lượng cao
          </h3>
          <p className="text-grayish-blue text-base">
          Từ thương hiệu yêu thích của bạn đến xu hướng mới nhất, chúng tôi chỉ bán giày thể thao
          trong số những vật liệu tốt nhất và bền nhất mà bạn từng tìm thấy.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
