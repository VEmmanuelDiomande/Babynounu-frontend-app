export type SIGN_UP = {
  email: string;
  password: string;
  role: string;
  type: string
};

export type SIGN_IN = {
  email: string;
  password: string;
}

export type SIGN_VERIFY_EMAIL = {
  email: string;
  password: string;
}

export type SIGN_VERIFY_CODE = {
  email: string;
  code: string;
}

export type INPUT_ERROR = {
  path: string;
  message: string;
};
