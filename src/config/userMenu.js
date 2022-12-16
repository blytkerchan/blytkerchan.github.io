const userMenu = [
  {
    path: "/help",
    title: "Help",
    icon: "bi-question-circle",
  },
  {
    title: "Terms & Policies",
    icon: "bi-file-earmark-text",
    children: [
      {
        path: "/terms/user-agreement",
        title: "User agreement",
        icon: "bi-file-earmark-text",
      },
      {
        path: "/terms/privacy-policy",
        title: "Privacy policy",
        icon: "bi-file-earmark-text",
      },
    ],
  },
];

export default userMenu;
