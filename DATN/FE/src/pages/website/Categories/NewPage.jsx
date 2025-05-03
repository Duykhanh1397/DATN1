import React, { useState } from "react";
import "./NewsPage.css";

const blogPosts = [
  {
    id: 1,
    title:
      "iPhone 15 Pro Max: Đỉnh cao công nghệ với những nâng cấp đáng kinh ngạc",
    category: "iPhone",
    date: "22 April 2025",
    readTime: "10 min",
    image:
      "https://cdn.tgdd.vn/Products/Images/42/305658/s16/iphone-15-pro-max-blue-1-2-650x650.png",
    excerpt: (
      <div>
        <p>
          iPhone 15 Pro Max không chỉ là một chiếc điện thoại – đó là một kiệt
          tác công nghệ. Với camera 48MP tiên tiến hỗ trợ quay video 8K, chip
          A18 Bionic mạnh mẽ tiết kiệm năng lượng hơn 20% so với thế hệ trước,
          thiết kế titan siêu nhẹ và bền bỉ, cùng cổng USB-C sạc nhanh, đây là
          lựa chọn hàng đầu cho những ai đam mê công nghệ hiện đại. Màn hình
          ProMotion 120Hz với độ sáng 2000 nits và tính năng Action Button mới
          giúp bạn làm chủ mọi tác vụ một cách dễ dàng.
        </p>
      </div>
    ),
    content: (
      <div>
        <h2>
          iPhone 15 Pro Max: Đỉnh cao công nghệ với những nâng cấp đáng kinh
          ngạc
        </h2>
        <p className="meta-info">
          <strong>Ngày đăng:</strong> 22 April 2025 |{" "}
          <strong>Thời gian đọc:</strong> 10 min
        </p>
        <p>
          iPhone 15 Pro Max đánh dấu một bước tiến lớn trong dòng sản phẩm cao
          cấp của Apple, mang đến trải nghiệm vượt trội cho cả người dùng thông
          thường và chuyên nghiệp. Điểm nhấn đầu tiên phải kể đến hệ thống
          camera được nâng cấp mạnh mẽ với cảm biến chính 48MP, hỗ trợ quay
          video 8K với độ chi tiết đáng kinh ngạc. Công nghệ Computational
          Photography cải tiến giúp chụp ảnh thiếu sáng tốt hơn bao giờ hết,
          trong khi chế độ ProRAW và ProRes mở ra không gian sáng tạo vô hạn cho
          các nhiếp ảnh gia và nhà làm phim.
        </p>
        <p>
          Về hiệu năng, iPhone 15 Pro Max được trang bị chip A18 Bionic – con
          chip mạnh nhất từ trước đến nay của Apple, với CPU 6 lõi và GPU 5 lõi,
          nhanh hơn 30% so với A17 Pro. Không chỉ mạnh mẽ, A18 còn tiết kiệm
          năng lượng hơn 20%, kéo dài thời lượng pin lên đến 29 giờ sử dụng liên
          tục. Thiết kế của máy cũng được cải tiến với khung titan cấp độ hàng
          không vũ trụ, vừa nhẹ hơn 10% so với thế hệ trước, vừa tăng độ bền
          vượt trội, chống va đập và trầy xước hiệu quả.
        </p>
        <p>
          Màn hình Super Retina XDR 6.7 inch với tần số quét ProMotion 120Hz
          mang lại trải nghiệm mượt mà, từ lướt web đến chơi game đồ họa cao. Độ
          sáng tối đa 2000 nits đảm bảo bạn có thể sử dụng thoải mái ngay cả
          dưới ánh nắng trực tiếp. Tính năng Action Button mới thay thế nút gạt
          âm thanh truyền thống, cho phép bạn tùy chỉnh nhanh các chức năng như
          mở camera, ghi âm, hoặc bật đèn pin – một sự đổi mới nhỏ nhưng cực kỳ
          tiện lợi.
        </p>
        <p>
          Cuối cùng, iPhone 15 Pro Max chuyển sang sử dụng cổng USB-C, hỗ trợ
          sạc nhanh 50% trong 30 phút và truyền dữ liệu tốc độ cao lên đến
          10Gbps. Với iOS 18, máy cũng được tích hợp hàng loạt tính năng thông
          minh như cải tiến Siri, chế độ Focus nâng cao, và khả năng tùy chỉnh
          giao diện linh hoạt hơn. Đây chắc chắn là chiếc iPhone đáng sở hữu
          nhất trong năm 2025.
        </p>
      </div>
    ),
  },
  {
    id: 2,
    title:
      "Top 5 Phụ Kiện Không Thể Thiếu Cho iPad: Biến thiết bị của bạn thành công cụ đa năng",
    category: "Phụ kiện",
    date: "20 April 2025",
    readTime: "6 min",
    image:
      "https://cdn.tgdd.vn/Products/Images/9499/230315/s16/adapter-sac-type-c-20w-cho-iphone-ipad-apple-mhje3-101021-023343-650x650.png",
    excerpt: (
      <div>
        <p>
          iPad là một thiết bị mạnh mẽ, nhưng để khai thác hết tiềm năng của nó,
          bạn cần những phụ kiện phù hợp. Bài viết này giới thiệu 5 phụ kiện
          không thể thiếu: Apple Pencil 2 hỗ trợ ghi chú và vẽ chính xác, Magic
          Keyboard biến iPad thành laptop tiện lợi, bộ sạc nhanh 20W giúp sạc
          đầy trong thời gian ngắn, giá đỡ tản nhiệt giữ máy mát mẻ khi làm việc
          nặng, và AirPods Pro mang đến âm thanh chất lượng cao cho giải trí
          đỉnh cao.
        </p>
      </div>
    ),
    content: (
      <div>
        <h2>
          Top 5 Phụ Kiện Không Thể Thiếu Cho iPad: Biến thiết bị của bạn thành
          công cụ đa năng
        </h2>
        <p className="meta-info">
          <strong>Ngày đăng:</strong> 20 April 2025 |{" "}
          <strong>Thời gian đọc:</strong> 6 min
        </p>
        <p>
          iPad từ lâu đã trở thành một công cụ không thể thiếu cho công việc,
          học tập và giải trí, nhưng để tận dụng tối đa sức mạnh của nó, bạn cần
          những phụ kiện phù hợp. Dưới đây là danh sách 5 phụ kiện hàng đầu mà
          bất kỳ người dùng iPad nào cũng nên sở hữu để nâng tầm trải nghiệm.
        </p>
        <ol>
          <li>
            <strong>Apple Pencil 2:</strong> Với độ trễ gần như bằng 0, Apple
            Pencil 2 là công cụ hoàn hảo cho việc ghi chú, phác thảo ý tưởng,
            hoặc chỉnh sửa ảnh. Tính năng gắn từ tính và sạc không dây trên iPad
            Pro/Air giúp bạn luôn sẵn sàng sử dụng mọi lúc.
          </li>
          <li>
            <strong>Magic Keyboard:</strong> Biến iPad thành một chiếc laptop
            thực thụ với bàn phím có đèn nền và trackpad tích hợp. Magic
            Keyboard không chỉ hỗ trợ gõ nhanh mà còn cung cấp góc nhìn linh
            hoạt nhờ cơ chế điều chỉnh góc nghiêng.
          </li>
          <li>
            <strong>Bộ sạc nhanh 20W:</strong> Bộ sạc USB-C 20W của Apple giúp
            sạc iPad từ 0-50% chỉ trong 30 phút, tiết kiệm thời gian tối đa. Đi
            kèm cáp USB-C to USB-C chính hãng, đây là giải pháp sạc nhanh và an
            toàn cho mọi dòng iPad.
          </li>
          <li>
            <strong>Giá đỡ tản nhiệt:</strong> Khi làm việc nặng như chỉnh sửa
            video hoặc chơi game, iPad có thể nóng lên. Một giá đỡ tản nhiệt với
            quạt làm mát tích hợp sẽ giữ máy ở nhiệt độ ổn định, đồng thời giúp
            bạn điều chỉnh góc nhìn thoải mái.
          </li>
          <li>
            <strong>AirPods Pro:</strong> Đem đến trải nghiệm âm thanh vòm với
            công nghệ Spatial Audio và chế độ khử tiếng ồn chủ động (ANC),
            AirPods Pro là bạn đồng hành lý tưởng khi xem phim, nghe nhạc, hoặc
            tham gia các cuộc gọi Zoom.
          </li>
        </ol>
        <p>
          Với những phụ kiện trên, iPad của bạn sẽ không chỉ là một chiếc máy
          tính bảng, mà còn là một công cụ đa năng đáp ứng mọi nhu cầu từ sáng
          tạo, làm việc đến giải trí. Hãy đầu tư ngay để tối ưu hóa trải nghiệm
          của bạn!
        </p>
      </div>
    ),
  },
  {
    id: 3,
    title:
      "iPad Air 6 M2: Máy tính bảng đa năng cho mọi nhu cầu từ học tập đến sáng tạo",
    category: "iPad",
    date: "18 April 2025",
    readTime: "7 min",
    image:
      "https://cdn.tgdd.vn/Products/Images/522/325521/s16/ipad-air-m2-11-inch-wifi-cellular-blue-thumb-650x650.png",
    excerpt: (
      <div>
        <p>
          iPad Air 6 M2 là sự kết hợp hoàn hảo giữa hiệu năng vượt trội và tính
          di động tối ưu. Được trang bị chip M2 mạnh mẽ, màn hình Liquid Retina
          11 inch sắc nét, hỗ trợ Apple Pencil 2 và Magic Keyboard, chiếc máy
          tính bảng này đáp ứng mọi nhu cầu từ học tập, làm việc đến sáng tạo
          nội dung. Với pin 10 giờ và kết nối 5G/Wi-Fi 6E, iPad Air 6 M2 là
          người bạn đồng hành lý tưởng cho mọi hoạt động.
        </p>
      </div>
    ),
    content: (
      <div>
        <h2>
          iPad Air 6 M2: Máy tính bảng đa năng cho mọi nhu cầu từ học tập đến
          sáng tạo
        </h2>
        <p className="meta-info">
          <strong>Ngày đăng:</strong> 18 April 2025 |{" "}
          <strong>Thời gian đọc:</strong> 7 min
        </p>
        <p>
          iPad Air 6 M2 là một trong những máy tính bảng ấn tượng nhất của Apple
          trong năm 2025, mang đến sự cân bằng hoàn hảo giữa hiệu năng, thiết kế
          và tính di động. Với chip M2 – cùng con chip được sử dụng trên dòng
          MacBook Pro – iPad Air 6 có khả năng xử lý mượt mà các tác vụ nặng như
          chỉnh sửa video 4K, chơi game đồ họa cao, hoặc chạy nhiều ứng dụng
          cùng lúc mà không hề giật lag.
        </p>
        <p>
          Màn hình Liquid Retina 11 inch với độ phân giải 2360x1640 và công nghệ
          True Tone mang lại hình ảnh sống động, sắc nét, lý tưởng cho việc xem
          phim, đọc sách, hoặc làm việc với các phần mềm thiết kế như Procreate.
          Hỗ trợ Apple Pencil 2 với tính năng Hover giúp bạn thao tác chính xác
          hơn khi vẽ hoặc ghi chú, trong khi Magic Keyboard biến iPad Air 6
          thành một chiếc laptop nhỏ gọn, phù hợp cho công việc văn phòng hoặc
          học tập.
        </p>
        <p>
          Về kết nối, iPad Air 6 M2 hỗ trợ 5G (tùy phiên bản) và Wi-Fi 6E, đảm
          bảo tốc độ mạng nhanh và ổn định, ngay cả khi bạn đang di chuyển. Pin
          28.6Wh cho phép sử dụng liên tục trong 10 giờ, đủ để bạn làm việc hoặc
          giải trí cả ngày dài. Cổng USB-C tốc độ cao không chỉ hỗ trợ sạc nhanh
          mà còn cho phép kết nối với các thiết bị ngoại vi như ổ cứng SSD hoặc
          màn hình ngoài.
        </p>
        <p>
          Được chạy trên iPadOS 18, iPad Air 6 M2 cung cấp hàng loạt tính năng
          thông minh như Stage Manager để quản lý đa nhiệm, hỗ trợ ứng dụng
          Final Cut Pro và Logic Pro cho chỉnh sửa video và âm thanh chuyên
          nghiệp, cùng khả năng tùy chỉnh giao diện linh hoạt. Nếu bạn đang tìm
          kiếm một chiếc máy tính bảng đa năng, iPad Air 6 M2 chắc chắn là lựa
          chọn không thể bỏ qua.
        </p>
      </div>
    ),
  },
  {
    id: 4,
    title:
      "Apple Watch Series 9: Trợ lý sức khỏe thông minh với công nghệ tiên tiến",
    category: "Watch",
    date: "16 April 2025",
    readTime: "5 min",
    image:
      "https://cdn.tgdd.vn/Products/Images/7077/315998/s16/apple-watch-s9-vien-nhom-day-vai-xanh-den-tb-1-1-650x650.png",
    excerpt: (
      <div>
        <p>
          Apple Watch Series 9 không chỉ là một chiếc đồng hồ thông minh – đó là
          trợ lý sức khỏe cá nhân của bạn. Với cảm biến đo nhiệt độ, SpO2, theo
          dõi nhịp tim và phát hiện té ngã, Series 9 giúp bạn chăm sóc sức khỏe
          toàn diện. Màn hình always-on Retina sáng hơn 30%, chip S9 nhanh hơn,
          pin 18 giờ với sạc nhanh, cùng watchOS 11 mang đến giao diện tùy chỉnh
          và tính năng thông minh vượt trội.
        </p>
      </div>
    ),
    content: (
      <div>
        <h2>
          Apple Watch Series 9: Trợ lý sức khỏe thông minh với công nghệ tiên
          tiến
        </h2>
        <p className="meta-info">
          <strong>Ngày đăng:</strong> 16 April 2025 |{" "}
          <strong>Thời gian đọc:</strong> 5 min
        </p>
        <p>
          Apple Watch Series 9 là bước tiến mới trong dòng đồng hồ thông minh
          của Apple, tập trung vào việc chăm sóc sức khỏe và nâng cao trải
          nghiệm người dùng. Được trang bị cảm biến đo nhiệt độ cơ thể, SpO2 (đo
          nồng độ oxy trong máu), và theo dõi nhịp tim chính xác, Series 9 giúp
          bạn theo dõi sức khỏe hàng ngày một cách chi tiết. Tính năng phát hiện
          té ngã và SOS khẩn cấp được cải tiến, mang lại sự an tâm cho người
          dùng, đặc biệt là người cao tuổi.
        </p>
        <p>
          Màn hình always-on Retina trên Series 9 có độ sáng tối đa 2000 nits –
          sáng hơn 30% so với Series 8 – giúp bạn dễ dàng xem thông tin ngay cả
          dưới ánh nắng mặt trời. Chip S9 mới nhanh hơn 25%, cải thiện hiệu suất
          xử lý và tiết kiệm năng lượng, cho phép đồng hồ hoạt động liên tục
          trong 18 giờ chỉ với một lần sạc. Tính năng sạc nhanh giúp đạt 80% pin
          chỉ trong 45 phút, rất tiện lợi cho những người bận rộn.
        </p>
        <p>
          watchOS 11 mang đến nhiều cải tiến đáng giá, từ giao diện mặt đồng hồ
          mới với khả năng tùy chỉnh linh hoạt, đến các tính năng thông minh như
          Double Tap – cho phép bạn điều khiển đồng hồ chỉ bằng cách chạm hai
          ngón tay. Series 9 cũng hỗ trợ theo dõi giấc ngủ chi tiết, các bài tập
          thể dục đa dạng, và tích hợp với Apple Fitness+ để bạn duy trì lối
          sống lành mạnh.
        </p>
        <p>
          Với thiết kế thanh lịch, nhiều tùy chọn dây đeo từ silicone, vải đến
          thép không gỉ, Apple Watch Series 9 không chỉ là một thiết bị công
          nghệ mà còn là một phụ kiện thời trang đẳng cấp. Đây là chiếc đồng hồ
          thông minh hoàn hảo cho những ai muốn kết hợp giữa sức khỏe, công nghệ
          và phong cách.
        </p>
      </div>
    ),
  },
  {
    id: 5,
    title:
      "iPad Air 6 M2 13 inch: Màn hình lớn, hiệu năng mạnh mẽ cho công việc sáng tạo",
    category: "iPad",
    date: "14 April 2025",
    readTime: "8 min",
    image:
      "https://cdn.tgdd.vn/Products/Images/522/325503/s16/ipad-air-m2-11-inch-wifi-gray-thumb-650x650.png",
    excerpt: (
      <div>
        <p>
          iPad Air 6 M2 phiên bản 13 inch là lựa chọn lý tưởng cho những ai cần
          một màn hình lớn để làm việc sáng tạo hoặc giải trí đỉnh cao. Chip M2
          mạnh mẽ xử lý mượt mà các tác vụ nặng, màn hình Liquid Retina 13 inch
          với True Tone hiển thị sống động, hỗ trợ Apple Pencil Hover và kết nối
          5G/Wi-Fi 6E. Đây là công cụ hoàn hảo cho thiết kế, chỉnh sửa video,
          hoặc trải nghiệm đa phương tiện.
        </p>
      </div>
    ),
    content: (
      <div>
        <h2>
          iPad Air 6 M2 13 inch: Màn hình lớn, hiệu năng mạnh mẽ cho công việc
          sáng tạo
        </h2>
        <p className="meta-info">
          <strong>Ngày đăng:</strong> 14 April 2025 |{" "}
          <strong>Thời gian đọc:</strong> 8 min
        </p>
        <p>
          iPad Air 6 M2 13 inch là phiên bản lớn nhất trong dòng iPad Air, được
          thiết kế để đáp ứng nhu cầu của những người dùng cần không gian làm
          việc rộng rãi mà vẫn đảm bảo tính di động. Với chip M2 – cùng con chip
          được trang bị trên MacBook Air M2 – iPad Air 6 mang đến hiệu năng vượt
          trội, xử lý mượt mà các tác vụ nặng như chỉnh sửa video 4K trên Final
          Cut Pro, thiết kế đồ họa 3D trên Procreate, hoặc chơi các tựa game AAA
          như Genshin Impact ở cấu hình cao nhất.
        </p>
        <p>
          Màn hình Liquid Retina 13 inch với độ phân giải 2732x2048 và công nghệ
          True Tone hiển thị màu sắc sống động, độ tương phản cao, lý tưởng cho
          việc xem phim 4K hoặc làm việc với các dự án sáng tạo đòi hỏi độ chính
          xác màu sắc. Tính năng hỗ trợ Apple Pencil Hover cho phép bạn xem
          trước nét vẽ trước khi chạm bút, rất hữu ích cho các nhà thiết kế và
          nghệ sĩ kỹ thuật số. Ngoài ra, iPad Air 6 tương thích với Magic
          Keyboard và Smart Keyboard Folio, biến máy thành một công cụ làm việc
          chuyên nghiệp.
        </p>
        <p>
          Về kết nối, iPad Air 6 M2 hỗ trợ 5G (tùy phiên bản) và Wi-Fi 6E, mang
          lại tốc độ tải xuống và truyền phát nhanh hơn bao giờ hết. Cổng USB-C
          tốc độ cao cho phép kết nối với màn hình ngoài 6K, ổ SSD, hoặc các phụ
          kiện khác, mở rộng khả năng làm việc đa nhiệm. Pin 28.6Wh cung cấp
          thời lượng sử dụng lên đến 10 giờ, đủ để bạn làm việc hoặc giải trí cả
          ngày dài mà không lo hết pin.
        </p>
        <p>
          Chạy trên iPadOS 18, iPad Air 6 M2 được tích hợp các tính năng thông
          minh như Stage Manager để quản lý nhiều ứng dụng cùng lúc, hỗ trợ ứng
          dụng chuyên nghiệp như Logic Pro và DaVinci Resolve, cùng khả năng tùy
          chỉnh giao diện linh hoạt. Với thiết kế mỏng nhẹ chỉ 6.1mm và trọng
          lượng 618g, iPad Air 6 M2 13 inch là sự lựa chọn hoàn hảo cho những ai
          cần một thiết bị mạnh mẽ, đa năng và dễ dàng mang theo.
        </p>
      </div>
    ),
  },
  {
    id: 6,
    title:
      "Apple Watch Series 9 GPS + Cellular: Kết nối mọi lúc, mọi nơi mà không cần iPhone",
    category: "Watch",
    date: "12 April 2025",
    readTime: "6 min",
    image:
      "https://cdn.tgdd.vn/Products/Images/7077/314708/s16/apple-watch-s9-45mm-vien-nhom-day-silicone-do-thumb-650x650.png",
    excerpt: (
      <div>
        <p>
          Apple Watch Series 9 GPS + Cellular mang đến tự do kết nối mà không
          cần iPhone bên cạnh. Với hỗ trợ LTE qua eSIM, bạn có thể gọi điện,
          nhắn tin, hoặc stream nhạc trực tiếp từ cổ tay. Chip S9 nhanh hơn 25%,
          tính năng Double Tap điều khiển tiện lợi, màn hình sáng 2000 nits, và
          pin sạc nhanh giúp bạn luôn sẵn sàng cho mọi hoạt động trong ngày.
        </p>
      </div>
    ),
    content: (
      <div>
        <h2>
          Apple Watch Series 9 GPS + Cellular: Kết nối mọi lúc, mọi nơi mà không
          cần iPhone
        </h2>
        <p className="meta-info">
          <strong>Ngày đăng:</strong> 12 April 2025 |{" "}
          <strong>Thời gian đọc:</strong> 6 min
        </p>
        <p>
          Apple Watch Series 9 GPS + Cellular là phiên bản cao cấp của dòng
          Series 9, được thiết kế để mang lại sự tự do tối đa cho người dùng.
          Nhờ hỗ trợ kết nối LTE qua eSIM, bạn có thể nhận cuộc gọi, gửi tin
          nhắn, hoặc stream nhạc trực tiếp từ Apple Music mà không cần mang theo
          iPhone – lý tưởng cho những buổi chạy bộ, tập gym, hoặc khi bạn muốn
          để điện thoại ở nhà.
        </p>
        <p>
          Chip S9 mới trên Series 9 nhanh hơn 25% so với thế hệ trước, cải thiện
          hiệu suất xử lý và tiết kiệm năng lượng, cho phép đồng hồ hoạt động
          mượt mà với mọi tác vụ, từ theo dõi sức khỏe đến chạy ứng dụng. Tính
          năng Double Tap – một cải tiến độc đáo – cho phép bạn điều khiển đồng
          hồ chỉ bằng cách chạm ngón cái và ngón trỏ, ví dụ để trả lời cuộc gọi
          hoặc tạm dừng nhạc, rất tiện lợi khi bạn đang bận tay.
        </p>
        <p>
          Màn hình always-on Retina với độ sáng tối đa 2000 nits đảm bảo bạn có
          thể xem thông tin rõ ràng ngay cả dưới ánh nắng gay gắt. Apple Watch
          Series 9 cũng được trang bị các cảm biến sức khỏe tiên tiến như đo
          nhiệt độ, SpO2, và theo dõi nhịp tim, cùng với khả năng phát hiện té
          ngã và SOS khẩn cấp. Tính năng theo dõi giấc ngủ chi tiết và các bài
          tập thể dục đa dạng giúp bạn duy trì lối sống lành mạnh.
        </p>
        <p>
          Với thời lượng pin 18 giờ và sạc nhanh (80% trong 45 phút), Series 9
          GPS + Cellular đảm bảo bạn luôn sẵn sàng cho một ngày bận rộn. watchOS
          11 mang đến giao diện mặt đồng hồ mới, khả năng tùy chỉnh thông báo,
          và tích hợp với Apple Fitness+ để hỗ trợ bạn tập luyện hiệu quả hơn.
          Với thiết kế tinh tế và nhiều tùy chọn dây đeo, đây là chiếc đồng hồ
          thông minh đáng sở hữu cho mọi tín đồ công nghệ.
        </p>
      </div>
    ),
  },
  {
    id: 7,
    title: "Phụ kiện sạc nhanh 20W: Giải pháp sạc tối ưu cho iPhone và iPad",
    category: "Phụ kiện",
    date: "10 April 2025",
    readTime: "5 min",
    image:
      "https://cdn.tgdd.vn/Products/Images/9499/230315/s16/adapter-sac-type-c-20w-cho-iphone-ipad-apple-mhje3-101021-023343-650x650.png",
    excerpt: (
      <div>
        <p>
          Bộ sạc nhanh 20W của Apple là giải pháp sạc lý tưởng cho iPhone và
          iPad, giúp sạc từ 0-50% chỉ trong 30 phút. Tương thích với iPhone 15
          series, iPad Pro, Air, Mini qua cổng USB-C, bộ sạc này hỗ trợ Power
          Delivery (PD) đảm bảo an toàn và hiệu quả. Thiết kế nhỏ gọn, dễ mang
          theo, đây là phụ kiện không thể thiếu cho người dùng Apple.
        </p>
      </div>
    ),
    content: (
      <div>
        <h2>Phụ kiện sạc nhanh 20W: Giải pháp sạc tối ưu cho iPhone và iPad</h2>
        <p className="meta-info">
          <strong>Ngày đăng:</strong> 10 April 2025 |{" "}
          <strong>Thời gian đọc:</strong> 5 min
        </p>
        <p>
          Bộ sạc nhanh 20W của Apple là một trong những phụ kiện được người dùng
          iPhone và iPad ưa chuộng nhất nhờ hiệu suất vượt trội và tính tiện
          lợi. Với công suất 20W, bộ sạc này có thể sạc iPhone 15 series từ
          0-50% chỉ trong 30 phút, đồng thời hỗ trợ sạc nhanh cho các dòng iPad
          như iPad Pro, iPad Air, và iPad Mini thông qua cổng USB-C.
        </p>
        <p>
          Được thiết kế theo chuẩn Power Delivery (PD), bộ sạc 20W đảm bảo quá
          trình sạc không chỉ nhanh mà còn an toàn, tự động điều chỉnh dòng điện
          để bảo vệ pin thiết bị. Ngoài ra, bộ sạc này tương thích ngược với các
          thiết bị Apple cũ hơn sử dụng cáp USB-C to Lightning, giúp bạn tiết
          kiệm chi phí khi nâng cấp thiết bị mới.
        </p>
        <p>
          Thiết kế của bộ sạc 20W rất nhỏ gọn, chỉ nặng 63g và dễ dàng bỏ vào
          túi xách hoặc balo, lý tưởng cho những người thường xuyên di chuyển.
          Đi kèm với bộ sạc, Apple khuyến nghị sử dụng cáp USB-C to USB-C hoặc
          USB-C to Lightning chính hãng để đạt hiệu suất tối ưu. Ngoài ra, bộ
          sạc còn hỗ trợ sạc cho các phụ kiện khác như AirPods hoặc Apple Watch
          khi sử dụng cáp phù hợp.
        </p>
        <p>
          Với độ bền cao và hiệu suất ổn định, bộ sạc nhanh 20W là một khoản đầu
          tư xứng đáng cho bất kỳ người dùng Apple nào. Nếu bạn muốn tiết kiệm
          thời gian sạc và đảm bảo an toàn cho thiết bị của mình, đây chắc chắn
          là lựa chọn hàng đầu trong năm 2025.
        </p>
      </div>
    ),
  },
  {
    id: 8,
    title:
      "Ốp lưng Horizon Flame: Sự bảo vệ tối ưu và phong cách cho iPhone 15 Pro Max",
    category: "Phụ kiện",
    date: "8 April 2025",
    readTime: "4 min",
    image:
      "https://cdn.tgdd.vn/Products/Images/42/305658/s16/iphone-15-pro-max-blue-1-2-650x650.png",
    excerpt: (
      <div>
        <p>
          Ốp lưng Horizon Flame dành cho iPhone 15 Pro Max là sự kết hợp hoàn
          hảo giữa bảo vệ và phong cách. Với thiết kế chống sốc, mặt lưng trong
          suốt khoe trọn vẻ đẹp của máy, hỗ trợ MagSafe cho sạc không dây, cùng
          lớp phủ chống trầy xước và các nút bấm chính xác, đây là phụ kiện
          không thể thiếu để bảo vệ chiếc iPhone cao cấp của bạn.
        </p>
      </div>
    ),
    content: (
      <div>
        <h2>
          Ốp lưng Horizon Flame: Sự bảo vệ tối ưu và phong cách cho iPhone 15
          Pro Max
        </h2>
        <p className="meta-info">
          <strong>Ngày đăng:</strong> 8 April 2025 |{" "}
          <strong>Thời gian đọc:</strong> 4 min
        </p>
        <p>
          Ốp lưng Horizon Flame được thiết kế dành riêng cho iPhone 15 Pro Max,
          mang đến sự bảo vệ toàn diện mà vẫn giữ được vẻ đẹp nguyên bản của
          máy. Với mặt lưng trong suốt làm từ polycarbonate cao cấp, bạn có thể
          khoe trọn màu sắc và thiết kế titan sang trọng của iPhone 15 Pro Max
          mà không lo che khuất.
        </p>
        <p>
          Viền ốp được làm từ TPU mềm dẻo, có khả năng chống sốc vượt trội, bảo
          vệ máy khỏi những va chạm hoặc rơi rớt không mong muốn. Lớp phủ chống
          trầy xước trên bề mặt ốp giúp giữ cho sản phẩm luôn như mới, ngay cả
          sau thời gian dài sử dụng. Horizon Flame cũng được tích hợp vòng từ
          MagSafe, đảm bảo tương thích hoàn hảo với các phụ kiện sạc không dây,
          ví MagSafe, hoặc giá đỡ từ tính.
        </p>
        <p>
          Các nút bấm trên ốp được gia công chính xác, mang lại cảm giác bấm
          nhạy và thoải mái, không làm giảm trải nghiệm sử dụng. Ốp lưng cũng
          được thiết kế với viền cao hơn màn hình và camera, bảo vệ toàn diện
          các bộ phận dễ tổn thương của iPhone 15 Pro Max. Với trọng lượng chỉ
          35g, Horizon Flame hầu như không làm tăng độ dày của máy, mang lại cảm
          giác cầm nắm thoải mái.
        </p>
        <p>
          Horizon Flame không chỉ là một chiếc ốp lưng bảo vệ, mà còn là một phụ
          kiện thời trang giúp iPhone 15 Pro Max của bạn nổi bật. Nếu bạn đang
          tìm kiếm một sản phẩm vừa bền bỉ, vừa thẩm mỹ, đây chắc chắn là lựa
          chọn hoàn hảo trong năm 2025.
        </p>
      </div>
    ),
  },
  {
    id: 9,
    title:
      "Miếng dán cường lực JETech: Bảo vệ màn hình iPhone 15 Pro Max tối ưu",
    category: "Phụ kiện",
    date: "6 April 2025",
    readTime: "3 min",
    image:
      "https://cdn.tgdd.vn/Products/Images/9499/230315/s16/adapter-sac-type-c-20w-cho-iphone-ipad-apple-mhje3-101021-023343-650x650.png",
    excerpt: (
      <div>
        <p>
          Miếng dán cường lực JETech cho iPhone 15 Pro Max mang đến sự bảo vệ
          tối ưu với độ cứng 9H chống va đập và trầy xước. Thiết kế viền đen ôm
          sát màn hình, không làm giảm độ nhạy cảm ứng, cùng lớp phủ chống bám
          vân tay và keo chất lượng cao giúp lắp đặt dễ dàng, giữ cho màn hình
          của bạn luôn trong trạng thái hoàn hảo.
        </p>
      </div>
    ),
    content: (
      <div>
        <h2>
          Miếng dán cường lực JETech: Bảo vệ màn hình iPhone 15 Pro Max tối ưu
        </h2>
        <p className="meta-info">
          <strong>Ngày đăng:</strong> 6 April 2025 |{" "}
          <strong>Thời gian đọc:</strong> 3 min
        </p>
        <p>
          Miếng dán cường lực JETech là giải pháp bảo vệ màn hình hàng đầu cho
          iPhone 15 Pro Max, đảm bảo màn hình Super Retina XDR đắt giá của bạn
          luôn được an toàn trước những nguy cơ va đập hoặc trầy xước trong quá
          trình sử dụng hàng ngày. Với độ cứng 9H – mức cao nhất trong thang đo
          độ cứng – miếng dán này có khả năng chống lại các vật sắc nhọn như
          dao, chìa khóa, hoặc các va chạm không mong muốn.
        </p>
        <p>
          Thiết kế của JETech có viền đen ôm sát màn hình, không làm ảnh hưởng
          đến độ nhạy cảm ứng, đảm bảo bạn vẫn có trải nghiệm vuốt chạm mượt mà
          như khi không dùng miếng dán. Lớp phủ oleophobic chống bám vân tay
          giúp màn hình luôn sạch sẽ, giảm thiểu vết bẩn và dấu vân tay, đồng
          thời mang lại độ trong suốt cao để hiển thị hình ảnh sắc nét.
        </p>
        <p>
          Việc lắp đặt miếng dán JETech cũng rất dễ dàng nhờ lớp keo chất lượng
          cao, không để lại bong bóng khí và đảm bảo độ bám dính hoàn hảo. Miếng
          dán được cắt chính xác theo kích thước màn hình iPhone 15 Pro Max, bao
          gồm cả các phần cong ở viền, đảm bảo bảo vệ toàn diện mà không làm ảnh
          hưởng đến thẩm mỹ của máy.
        </p>
        <p>
          Với độ dày chỉ 0.33mm, miếng dán JETech gần như không làm tăng độ dày
          của màn hình, giữ nguyên cảm giác sử dụng tự nhiên. Nếu bạn muốn bảo
          vệ màn hình iPhone 15 Pro Max một cách tối ưu mà vẫn giữ được vẻ đẹp
          và tính năng của máy, JETech là sự lựa chọn không thể bỏ qua.
        </p>
      </div>
    ),
  },
  {
    id: 10,
    title:
      "Ốp lưng MagSafe JINYA T-Stand: Tiện ích và bảo vệ tối ưu cho iPhone 15 Pro Max",
    category: "Phụ kiện",
    date: "4 April 2025",
    readTime: "5 min",
    image:
      "https://cdn.tgdd.vn/Products/Images/42/305658/s16/iphone-15-pro-max-blue-1-2-650x650.png",
    excerpt: (
      <div>
        <p>
          Ốp lưng JINYA T-Stand cho iPhone 15 Pro Max là sự kết hợp hoàn hảo
          giữa bảo vệ, tiện ích và phong cách. Tích hợp giá đỡ kim loại có thể
          gập lại để dựng máy ngang/dọc khi xem video hoặc gọi FaceTime, hỗ trợ
          MagSafe cho sạc không dây, và thiết kế TPU chống sốc, đây là phụ kiện
          lý tưởng cho người dùng hiện đại.
        </p>
      </div>
    ),
    content: (
      <div>
        <h2>
          Ốp lưng MagSafe JINYA T-Stand: Tiện ích và bảo vệ tối ưu cho iPhone 15
          Pro Max
        </h2>
        <p className="meta-info">
          <strong>Ngày đăng:</strong> 4 April 2025 |{" "}
          <strong>Thời gian đọc:</strong> 5 min
        </p>
        <p>
          Ốp lưng JINYA T-Stand là một sản phẩm đột phá dành cho iPhone 15 Pro
          Max, mang đến sự kết hợp hoàn hảo giữa tính năng bảo vệ, tiện ích và
          phong cách. Điểm nổi bật nhất của ốp lưng này là giá đỡ kim loại tích
          hợp, có thể gập lại linh hoạt, cho phép bạn dựng iPhone ở cả chế độ
          ngang và dọc – lý tưởng để xem video, gọi FaceTime, hoặc làm việc từ
          xa mà không cần phụ kiện bổ sung.
        </p>
        <p>
          Được làm từ vật liệu TPU cao cấp, JINYA T-Stand có khả năng chống sốc
          vượt trội, bảo vệ iPhone 15 Pro Max khỏi những va chạm hoặc rơi rớt
          trong quá trình sử dụng hàng ngày. Mặt lưng trong suốt cho phép bạn
          khoe trọn thiết kế titan sang trọng của máy, trong khi lớp phủ chống
          trầy xước giúp ốp luôn giữ được vẻ đẹp như mới sau thời gian dài sử
          dụng.
        </p>
        <p>
          JINYA T-Stand được tích hợp vòng từ MagSafe, đảm bảo tương thích hoàn
          hảo với các phụ kiện sạc không dây, ví MagSafe, hoặc giá đỡ từ tính.
          Các nút bấm trên ốp được thiết kế chính xác, mang lại cảm giác bấm
          nhạy và thoải mái, trong khi viền ốp cao hơn màn hình và camera giúp
          bảo vệ các bộ phận dễ tổn thương của máy.
        </p>
        <p>
          Với trọng lượng nhẹ và thiết kế mỏng, JINYA T-Stand không làm tăng độ
          dày của iPhone 15 Pro Max, mang lại cảm giác cầm nắm tự nhiên và thoải
          mái. Đây là lựa chọn lý tưởng cho những ai muốn bảo vệ máy một cách
          tối ưu, đồng thời tận hưởng sự tiện lợi và phong cách trong một sản
          phẩm duy nhất.
        </p>
      </div>
    ),
  },
];

const BlogCard = ({ post, onSelect }) => (
  <div className="col">
    <div
      onClick={() => onSelect(post)}
      className="card h-100 bg-dark text-light border-0 shadow-lg rounded-4 hover-lift animate__animated animate__fadeIn animate__delay-1s"
      style={{ cursor: "pointer" }}
    >
      <div className="image-wrapper">
        <img
          src={post.image}
          className="card-img-top rounded-top"
          alt={post.title}
          style={{
            width: "100%",
            height: "auto",
            objectFit: "contain",
          }}
        />
      </div>
      <div className="card-body px-4 py-3">
        <div
          className={`small fw-semibold mb-2 category-${post.category.toLowerCase()} animate__animated animate__fadeInLeft animate__delay-2s`}
        >
          {post.category}
        </div>
        <h6 className="fw-bold mb-2 animate__animated animate__fadeInUp animate__delay-2s">
          {post.title}
        </h6>
        <div className="text-muted small mb-3 animate__animated animate__fadeIn animate__delay-3s">
          {post.excerpt}
        </div>
        <div className="d-flex justify-content-between text-muted small animate__animated animate__fadeIn animate__delay-3s">
          <span>{post.date}</span>
          <span>{post.readTime}</span>
        </div>
      </div>
    </div>
  </div>
);

const FeaturedPost = ({ post, onSelect }) => (
  <div
    onClick={() => onSelect(post)}
    style={{ cursor: "pointer" }}
    className="row align-items-center mb-5 bg-dark p-4 rounded-4 shadow-lg animate__animated animate__zoomIn"
  >
    <div className="col-md-6 mb-3 mb-md-0">
      <div className="image-wrapper">
        <img
          src={post.image}
          className="w-100 rounded-4 border"
          alt={post.title}
          style={{
            width: "100%",
            height: "auto",
            objectFit: "contain",
          }}
        />
      </div>
    </div>
    <div className="col-md-6 text-light">
      <div
        className={`small fw-semibold mb-2 category-${post.category.toLowerCase()} animate__animated animate__fadeInLeft animate__delay-1s`}
      >
        {post.category}
      </div>
      <h4 className="fw-bold mb-3 animate__animated animate__fadeInUp animate__delay-1s">
        {post.title}
      </h4>
      <div className="text-muted mb-3 animate__animated animate__fadeIn animate__delay-2s">
        {post.excerpt}
      </div>
      <div className="d-flex justify-content-between text-muted small animate__animated animate__fadeIn animate__delay-2s">
        <span>{post.date}</span>
        <span>{post.readTime}</span>
      </div>
    </div>
  </div>
);

function NewsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedPost, setSelectedPost] = useState(null);

  const categories = [
    "Tất cả",
    ...new Set(blogPosts.map((post) => post.category)),
  ];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Tất cả" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featured = filteredPosts[0];
  const others = filteredPosts.slice(1);

  // Hiển thị chi tiết bài viết
  if (selectedPost) {
    return (
      <div
        className="container py-5 animate__animated animate__fadeIn"
        style={{ backgroundColor: "#1a1a1a" }}
      >
        <button
          onClick={() => setSelectedPost(null)}
          className="btn btn-outline-light mb-4 d-inline-flex align-items-center animate__animated animate__fadeInDown glow-on-hover"
          style={{ transition: "all 0.3s ease" }}
        >
          <span className="me-2">←</span> Quay lại
        </button>
        <div className="bg-dark p-5 rounded-4 shadow-lg text-light animate__animated animate__zoomIn content-reveal">
          <div className="image-wrapper mb-4">
            <img
              src={selectedPost.image}
              className="w-100 rounded-4 image-pop"
              alt={selectedPost.title}
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </div>
          <div className="content-slide-in">{selectedPost.content}</div>
        </div>
      </div>
    );
  }

  // Hiển thị danh sách bài viết
  return (
    <div style={{ backgroundColor: "#1a1a1a", minHeight: "100vh" }}>
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-5 animate__animated animate__fadeInDown">
          <h3 className="fw-bold text-white mb-0 title-glow">
            Tin Tức Công Nghệ
          </h3>
          <div className="d-flex gap-3">
            <input
              type="text"
              className="form-control rounded-pill bg-dark text-light border-0 shadow-sm input-slide"
              placeholder="Tìm kiếm bài viết..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                maxWidth: "300px",
                transition: "all 0.3s ease",
              }}
            />
            <select
              className="form-select rounded-pill bg-dark text-light border-0 shadow-sm input-slide"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                maxWidth: "200px",
                transition: "all 0.3s ease",
              }}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
        {featured ? (
          <>
            <FeaturedPost post={featured} onSelect={setSelectedPost} />
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {others.map((post) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  onSelect={setSelectedPost}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-white text-center py-5 animate__animated animate__fadeIn">
            Không tìm thấy bài viết nào phù hợp.
          </div>
        )}
      </div>
    </div>
  );
}

export default NewsPage;
