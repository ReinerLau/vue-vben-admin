import { useI18n } from '@/hooks/web/useI18n';
import type { FormInstance } from 'ant-design-vue/lib/form/Form';
import type {
  NamePath,
  RuleObject,
  Rule as ValidationRule,
} from 'ant-design-vue/lib/form/interface';
import { computed, ref, Ref, unref } from 'vue';

/**
 * 登录表单状态枚举
 */
export enum LoginStateEnum {
  /**
   * 登录
   */
  LOGIN,
  /**
   * 注册
   */
  REGISTER,
  /**
   * 重置密码
   */
  RESET_PASSWORD,
  /**
   * 手机登录
   */
  MOBILE,
  /**
   * 二维码登录
   */
  QR_CODE,
}

/**
 * 当前登录表单状态
 */
const currentState = ref(LoginStateEnum.LOGIN);

// 这里也可以优化
// import { createGlobalState } from '@vueuse/core'

/**
 * 控制登录表单状态 hook
 */
export function useLoginState() {
  function setLoginState(state: LoginStateEnum) {
    currentState.value = state;
  }

  const getLoginState = computed(() => currentState.value);

  function handleBackLogin() {
    setLoginState(LoginStateEnum.LOGIN);
  }

  return {
    /**
     * 设置登录表单状态
     */
    setLoginState,
    /**
     * 获取登录表单状态
     */
    getLoginState,
    /**
     * 返回登录状态
     */
    handleBackLogin,
  };
}

/**
 * 表单校验 hook
 * @param formRef 表单组件实例
 */
export function useFormValid<T extends Object = any>(formRef: Ref<FormInstance>) {
  const validate = computed(() => {
    const form = unref(formRef);
    return form?.validate ?? ((_nameList?: NamePath) => Promise.resolve());
  });

  async function validForm() {
    const form = unref(formRef);
    if (!form) return;
    const data = await form.validate();
    return data as T;
  }

  return {
    validate,
    /**
     * 校验表单
     */
    validForm,
  };
}
/**
 * 表单校验规则 hook
 * @param formData 表单数据
 */
export function useFormRules(formData?: Recordable) {
  const { t } = useI18n();
  /**
   * 获取账号校验规则
   */
  const getAccountFormRule = computed(() => createRule(t('sys.login.accountPlaceholder')));
  /**
   * 获取密码校验规则
   */
  const getPasswordFormRule = computed(() => createRule(t('sys.login.passwordPlaceholder')));
  /**
   * 获取短信验证码校验规则
   */
  const getSmsFormRule = computed(() => createRule(t('sys.login.smsPlaceholder')));
  /**
   * 获取手机号校验规则
   */
  const getMobileFormRule = computed(() => createRule(t('sys.login.mobilePlaceholder')));

  const validatePolicy = async (_: RuleObject, value: boolean) => {
    return !value ? Promise.reject(t('sys.login.policyPlaceholder')) : Promise.resolve();
  };
  /**
   * 生成确认密码校验规则
   * @param password 第一次输入的密码
   */
  const validateConfirmPassword = (password: string) => {
    return async (_: RuleObject, value: string) => {
      if (!value) {
        return Promise.reject(t('sys.login.passwordPlaceholder'));
      }
      if (value !== password) {
        return Promise.reject(t('sys.login.diffPwd'));
      }
      return Promise.resolve();
    };
  };
  const getFormRules = computed((): { [k: string]: ValidationRule | ValidationRule[] } => {
    /**
     * 账号校验规则
     */
    const accountFormRule = unref(getAccountFormRule);
    /**
     * 密码校验规则
     */
    const passwordFormRule = unref(getPasswordFormRule);
    /**
     * 短信验证码校验规则
     */
    const smsFormRule = unref(getSmsFormRule);
    /**
     * 手机号校验规则
     */
    const mobileFormRule = unref(getMobileFormRule);
    /**
     * 手机相关校验规则
     */
    const mobileRule = {
      sms: smsFormRule,
      mobile: mobileFormRule,
    };
    switch (unref(currentState)) {
      // register form rules
      case LoginStateEnum.REGISTER:
        return {
          account: accountFormRule,
          password: passwordFormRule,
          confirmPassword: [
            { validator: validateConfirmPassword(formData?.password), trigger: 'change' },
          ],
          policy: [{ validator: validatePolicy, trigger: 'change' }],
          ...mobileRule,
        };

      // reset password form rules
      case LoginStateEnum.RESET_PASSWORD:
        return {
          account: accountFormRule,
          ...mobileRule,
        };

      // mobile form rules
      case LoginStateEnum.MOBILE:
        return mobileRule;

      // login form rules
      default:
        return {
          account: accountFormRule,
          password: passwordFormRule,
        };
    }
  });
  return {
    /**
     * 获取表单校验规则
     */
    getFormRules,
  };
}

/**
 * 创建 antd 表单验证规则
 * @param message 校验失败提示信息
 */
function createRule(message: string): ValidationRule[] {
  return [
    {
      required: true,
      message,
      trigger: 'change',
    },
  ];
}
