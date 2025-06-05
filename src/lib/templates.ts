import { ResumeValues } from "./validation";
import { BorderStyle } from "@/app/(main)/editor/BorderStyleButton";
import { TemplateType } from "@/components/resume-templates";

// Cấu trúc cho resume template
export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  data: ResumeValues;
  templateType: TemplateType;
}

// Danh sách các template mẫu
export const resumeTemplates: ResumeTemplate[] = [
  {
    id: "template_0",
    name: "MặcMặc định",
    description: "",
    thumbnail: "/templates/template_0.webp",
    templateType: TemplateType.TEMPLATE_0,
    data: {
      title: "CV của tôi",
      firstName: "",
      lastName: "",
      jobTitle: "",
      city: "",
      country: "",
      email: "",
      phone: "",
      summary: "",
      shortTermGoals: "",
      longTermGoals: "",
      workExperiences: [],
      educations: [],
      skills: [],
      colorHex: "#000000",
      borderStyle: "square" as BorderStyle,
    },
  },
  {
    id: "template_1",
    name: "Mẫu 1",
    description: "",
    thumbnail: "/templates/template_2.webp",
    templateType: TemplateType.TEMPLATE_1,
    data: {
      title: "CV Chuyên nghiệp",
      firstName: "Nguyễn",
      lastName: "Văn A",
      jobTitle: "Kỹ sư phần mềm",
      city: "Hà Nội",
      country: "Việt Nam",
      email: "example@email.com",
      phone: "0123456789",
      summary:
        "Kỹ sư phần mềm với 5 năm kinh nghiệm trong phát triển web và mobile. Thành thạo ReactJS, Node.js và các công nghệ hiện đại.",
      shortTermGoals: "Phát triển kỹ năng quản lý dự án và trở thành team lead trong vòng 1-2 năm tới. Tham gia các dự án với công nghệ mới để nâng cao kiến thức chuyên môn.",
      longTermGoals: "Hướng tới vị trí kỹ sư trưởng (Principal Engineer) trong 3-5 năm, đóng góp vào các quyết định kiến trúc hệ thống và chiến lược công nghệ của công ty.",
      workExperiences: [
        {
          position: "Senior Frontend Developer",
          company: "Tech Company X",
          startDate: "2021-01-01",
          endDate: "2023-12-31",
          description:
            "Phát triển và duy trì các ứng dụng web với ReactJS, Redux. Tối ưu hiệu suất và cải thiện trải nghiệm người dùng.",
        },
        {
          position: "Web Developer",
          company: "Agency Y",
          startDate: "2018-06-01",
          endDate: "2020-12-31",
          description:
            "Xây dựng website cho khách hàng sử dụng HTML, CSS, JavaScript và các framework hiện đại.",
        },
      ],
      educations: [
        {
          degree: "Kỹ sư Công nghệ thông tin",
          school: "Đại học Bách Khoa Hà Nội",
          startDate: "2014-09-01",
          endDate: "2018-05-31",
        },
      ],
      skills: [
        "HTML",
        "CSS",
        "JavaScript",
        "ReactJS",
        "Node.js",
        "Git",
        "Redux",
        "TypeScript",
      ],
      colorHex: "#7c3aed",
      borderStyle: "square" as BorderStyle,
    },
  },
  {
    id: "template_2",
    name: "Mẫu 2",
    description: "",
    thumbnail: "/templates/template_3.webp",
    templateType: TemplateType.TEMPLATE_2,
    data: {
      title: "CV Sáng tạo",
      firstName: "Trần",
      lastName: "Thị B",
      jobTitle: "UI/UX Designer",
      city: "Hồ Chí Minh",
      country: "Việt Nam",
      email: "design@email.com",
      phone: "0987654321",
      summary:
        "Designer đam mê với 4 năm kinh nghiệm trong thiết kế UI/UX. Chuyên tạo ra các trải nghiệm người dùng đẹp mắt và trực quan.",
      shortTermGoals: "Nâng cao kỹ năng trong thiết kế hệ thống và animation. Tham gia các dự án lớn để phát triển portfolio cá nhân trong 1-2 năm tới.",
      longTermGoals: "Trở thành Design Lead cho một team thiết kế và xây dựng các sản phẩm với trải nghiệm người dùng xuất sắc. Đóng góp vào việc phát triển design system cho các sản phẩm quy mô lớn.",
      workExperiences: [
        {
          position: "Senior UI/UX Designer",
          company: "Creative Studio Z",
          startDate: "2020-03-01",
          endDate: "2023-12-31",
          description:
            "Thiết kế giao diện người dùng và trải nghiệm người dùng cho các ứng dụng web và mobile. Làm việc với các stakeholder để hiểu và đáp ứng yêu cầu.",
        },
        {
          position: "Graphic Designer",
          company: "Marketing Agency W",
          startDate: "2018-01-01",
          endDate: "2020-02-28",
          description:
            "Thiết kế các tài liệu marketing, banner, logo và ấn phẩm cho khách hàng.",
        },
      ],
      educations: [
        {
          degree: "Cử nhân Thiết kế Đồ họa",
          school: "Đại học Mỹ thuật TP.HCM",
          startDate: "2014-09-01",
          endDate: "2018-05-31",
        },
      ],
      skills: [
        "Figma",
        "Adobe XD",
        "Photoshop",
        "Illustrator",
        "UI Design",
        "UX Research",
        "Wireframing",
        "Prototyping",
      ],
      colorHex: "#a21caf",
      borderStyle: "squircle" as BorderStyle,
    },
  },
  {
    id: "template_3",
    name: "Mẫu 3",
    description: "",
    thumbnail: "/templates/template_4.webp",
    templateType: TemplateType.TEMPLATE_3,
    data: {
      title: "CV Tối giản",
      firstName: "Lê",
      lastName: "Văn C",
      jobTitle: "Project Manager",
      city: "Đà Nẵng",
      country: "Việt Nam",
      email: "manager@email.com",
      phone: "0369852147",
      summary:
        "Quản lý dự án với hơn 7 năm kinh nghiệm trong lĩnh vực công nghệ. Chuyên môn trong việc lập kế hoạch, triển khai và điều phối các dự án phát triển phần mềm quy mô lớn. Kỹ năng mạnh về lãnh đạo, giao tiếp và quản lý thời gian, giúp đội ngũ đạt hiệu suất tối đa. Có khả năng phân tích và giải quyết vấn đề phức tạp, đảm bảo dự án hoàn thành đúng tiến độ và ngân sách. Kinh nghiệm làm việc với nhiều phương pháp luận như Agile, Scrum, Waterfall.",
      shortTermGoals: "Hoàn thành chứng chỉ PMP trong vòng 1 năm tới và áp dụng kiến thức mới vào công việc. Tối ưu hóa quy trình quản lý dự án để tăng hiệu quả và giảm thời gian hoàn thành.",
      longTermGoals: "Thăng tiến lên vị trí Director of Project Management trong vòng 5 năm, quản lý nhiều nhóm dự án và tham gia vào việc định hướng chiến lược cho công ty.",
      workExperiences: [
        {
          position: "Senior Project Manager",
          company: "Tech Solutions Corp",
          startDate: "2019-06-01",
          endDate: "2023-12-31",
          description:
            "• Quản lý 5+ dự án phát triển phần mềm quy mô lớn từ khâu lên ý tưởng đến triển khai sản phẩm\n• Điều phối đội ngũ 15 người gồm developers, designers và QA, tăng hiệu suất làm việc lên 30%\n• Triển khai phương pháp Agile/Scrum, cải thiện chu kỳ phát triển nhanh hơn 25%\n• Quản lý ngân sách dự án lên đến 500.000 USD, tiết kiệm 15% chi phí thông qua tối ưu hóa quy trình\n• Giao tiếp trực tiếp với khách hàng, nắm bắt yêu cầu và đảm bảo sự hài lòng với tỷ lệ 95%",
        },
        {
          position: "Project Coordinator",
          company: "Digital Agency V",
          startDate: "2016-02-01",
          endDate: "2019-05-31",
          description:
            "• Hỗ trợ quản lý 10+ dự án web và mobile app cho các khách hàng doanh nghiệp\n• Lập kế hoạch, theo dõi tiến độ và báo cáo kết quả cho các bên liên quan\n• Phối hợp với đội ngũ phát triển để đảm bảo chất lượng và tiến độ dự án\n• Xây dựng và duy trì tài liệu dự án, quy trình làm việc và báo cáo trạng thái\n• Tổ chức họp sprint planning, daily standup và retrospective theo phương pháp Scrum",
        },
        {
          position: "Business Analyst",
          company: "Software Innovations Ltd",
          startDate: "2014-07-01",
          endDate: "2016-01-31",
          description:
            "• Phân tích yêu cầu kinh doanh và chuyển đổi thành đặc tả kỹ thuật\n• Tạo user stories, use cases và wireframes cho các tính năng phần mềm\n• Làm việc chặt chẽ với các bên liên quan để thu thập và làm rõ yêu cầu\n• Kiểm tra và đảm bảo chất lượng sản phẩm phù hợp với yêu cầu\n• Đào tạo người dùng về cách sử dụng phần mềm mới triển khai",
        },
      ],
      educations: [
        {
          degree: "Thạc sĩ Quản trị Kinh doanh",
          school: "Đại học Kinh tế Đà Nẵng",
          startDate: "2014-09-01",
          endDate: "2016-05-31",
        },
        {
          degree: "Cử nhân Công nghệ Thông tin",
          school: "Đại học Đà Nẵng",
          startDate: "2010-09-01",
          endDate: "2014-05-31",
        },
        {
          degree: "Chứng chỉ Quản lý Dự án Chuyên nghiệp (PMP)",
          school: "Project Management Institute",
          startDate: "2018-01-01",
          endDate: "2018-03-15",
        },
      ],
      skills: [
        "Quản lý dự án",
        "Agile/Scrum",
        "Kanban",
        "Jira",
        "MS Project",
        "Trello",
        "Asana",
        "Lãnh đạo",
        "Phân tích kinh doanh",
        "Quản lý rủi ro",
        "Đàm phán",
        "Lập kế hoạch",
        "Quản lý nguồn lực",
        "Báo cáo",
        "Office 365",
        "Tiếng Anh",
      ],
      colorHex: "#000000",
      borderStyle: "square" as BorderStyle,
    },
  },
  {
    id: "template_4",
    name: "Mẫu 4",
    description: "",
    thumbnail: "/templates/template_5.webp",
    templateType: TemplateType.TEMPLATE_4,
    data: {
      title: "CV Hiện đại",
      firstName: "Trần",
      lastName: "Minh",
      jobTitle: "Kỹ sư Phần mềm",
      city: "Hà Nội",
      country: "Việt Nam",
      email: "minhtran@example.com",
      phone: "0912345678",
      summary:
        "Kỹ sư phần mềm với 3 năm kinh nghiệm phát triển web. Có kiến thức vững về ReactJS, Node.js và tối ưu hóa hiệu suất ứng dụng.",
      shortTermGoals: "Phát triển sâu hơn về kiến trúc phần mềm và trở thành senior developer trong 1-2 năm tới.",
      longTermGoals: "Định hướng trở thành solution architect và đóng góp vào các dự án mã nguồn mở lớn.",
      workExperiences: [
        {
          position: "Frontend Developer",
          company: "Tech Solutions",
          startDate: "2022-01-01",
          endDate: "2023-12-31",
          description:
            "• Phát triển và tối ưu các ứng dụng web sử dụng React và TypeScript\n• Cải thiện hiệu suất trang web, giảm 40% thời gian tải trang\n• Xây dựng UI component library cho toàn công ty"
        },
        {
          position: "Web Developer",
          company: "Digital Agency",
          startDate: "2020-06-01",
          endDate: "2021-12-31",
          description:
            "• Xây dựng các website cho khách hàng sử dụng JavaScript và các framework hiện đại\n• Làm việc với team design để biến UI/UX mockup thành code hoạt động"
        }
      ],
      educations: [
        {
          degree: "Kỹ sư Công nghệ thông tin",
          school: "Đại học Bách Khoa Hà Nội",
          startDate: "2016-09-01",
          endDate: "2020-05-31"
        }
      ],
      skills: [
        "JavaScript",
        "TypeScript",
        "ReactJS",
        "Next.js",
        "Node.js",
        "HTML/CSS",
        "Git",
        "REST API"
      ],
      colorHex: "#1e7b77",
      borderStyle: "square" as BorderStyle
    }
  },
  /* Template 5 đã bị comment tạm thời
  {
    id: "template_5",
    name: "Mẫu 5",
    description: "",
    thumbnail: "/templates/template_5.webp",
    templateType: TemplateType.TEMPLATE_2,
    data: {
      title: "CV Thanh lịch",
      firstName: "Nguyễn",
      lastName: "Thảo",
      jobTitle: "Marketing Manager",
      city: "Thành phố Hồ Chí Minh",
      country: "Việt Nam",
      email: "nguyenthao@email.com",
      phone: "0987654321",
      summary:
        "Chuyên viên Marketing với 6 năm kinh nghiệm trong phát triển chiến lược, quản lý thương hiệu và tiếp thị số. Thành tích nổi bật trong việc tăng nhận diện thương hiệu và tỷ lệ chuyển đổi cho nhiều doanh nghiệp lớn.",
      shortTermGoals: "Phát triển kỹ năng trong Influencer Marketing và Content Strategy. Nâng cao hiệu quả các chiến dịch Marketing đa kênh.",
      longTermGoals: "Trở thành Marketing Director, dẫn dắt đội ngũ phát triển các chiến lược tiếp thị toàn diện và đổi mới, tạo dấu ấn riêng trong ngành.",
      workExperiences: [
        {
          position: "Senior Marketing Manager",
          company: "BrandVision",
          startDate: "2020-05-01",
          endDate: "2023-12-31",
          description:
            "• Phát triển và triển khai chiến lược marketing tổng thể cho nhiều thương hiệu\n• Quản lý ngân sách marketing hơn 1 tỷ VND hàng năm, đạt ROI trung bình 200%\n• Lãnh đạo đội ngũ 10 nhân viên marketing, bao gồm digital marketing, content và design\n• Tăng tương tác trên mạng xã hội 150% và tỷ lệ chuyển đổi 35% trong 2 năm",
        },
        {
          position: "Digital Marketing Specialist",
          company: "TechMedia",
          startDate: "2017-02-01",
          endDate: "2020-04-30",
          description:
            "• Quản lý các chiến dịch quảng cáo kỹ thuật số trên nhiều nền tảng\n• Phân tích dữ liệu và tối ưu hóa chiến dịch để tăng hiệu quả\n• Phát triển nội dung sáng tạo và hấp dẫn cho các kênh truyền thông xã hội\n• Tăng lượng truy cập trang web 75% và tỷ lệ chuyển đổi 25%",
        },
      ],
      educations: [
        {
          degree: "Thạc sĩ Quản trị Kinh doanh",
          school: "Đại học Kinh tế TP.HCM",
          startDate: "2015-09-01",
          endDate: "2017-06-30",
        },
        {
          degree: "Cử nhân Marketing",
          school: "Đại học Ngoại thương",
          startDate: "2011-09-01",
          endDate: "2015-05-31",
        },
      ],
      skills: [
        "Digital Marketing",
        "Brand Management",
        "Social Media Strategy",
        "Content Creation",
        "SEO/SEM",
        "Email Marketing",
        "Google Analytics",
        "Facebook Ads",
        "Instagram Marketing",
        "TikTok Marketing",
        "Adobe Creative Suite",
        "Project Management",
        "Team Leadership",
        "Budget Management",
        "Marketing Analytics",
      ],
      colorHex: "#000000",
      borderStyle: "squircle" as BorderStyle,
    },
  },
  */
];
