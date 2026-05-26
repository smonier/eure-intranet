import type { LoginPersonaProps } from "./types";
import brigitteP from "/static/img/users/brigitte.webp";
import brigitteM from "/static/img/users/brigitte.webm";
import mathieuP from "/static/img/users/mathieu.webp";
import mathieuM from "/static/img/users/mathieu.webm";
import sophieP from "/static/img/users/sophie.webp";
import sophieM from "/static/img/users/sophie.webm";

export const rawPersona: LoginPersonaProps[] = [
  {
    username: "brigitte",
    password: "brigitte",
    userinfo: {
      fullname: "Brigitte Renard",
      function: "form.login.persona.brigitte.function",
      avatar: {
        image: {
          url: brigitteP,
          alt: "form.login.persona.brigitte.alt",
        },
        video: {
          url: brigitteM,
        },
      },
      description: "form.login.persona.brigitte.description",
    },
  },
  {
    username: "mathieu",
    password: "mathieu",
    userinfo: {
      fullname: "Mathieu Clermont",
      function: "form.login.persona.mathieu.function",
      avatar: {
        image: {
          url: mathieuP,
          alt: "form.login.persona.mathieu.alt",
        },
        video: {
          url: mathieuM,
        },
      },
      description: "form.login.persona.mathieu.description",
    },
  },
  {
    username: "sophie",
    password: "sophie",
    userinfo: {
      fullname: "Sophie Durand",
      function: "form.login.persona.sophie.function",
      avatar: {
        image: {
          url: sophieP,
          alt: "form.login.persona.sophie.alt",
        },
        video: {
          url: sophieM,
        },
      },
      description: "form.login.persona.sophie.description",
    },
  },
];
