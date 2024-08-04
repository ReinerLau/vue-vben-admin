<template>
  <template v-if="getShow">
    <LoginFormTitle class="enter-x" />
    <Form class="p-4 enter-x" :model="formData" :rules="getFormRules" ref="formRef">
      <FormItem name="account" class="enter-x">
        <Input
          size="large"
          v-model:value="formData.account"
          :placeholder="t('sys.login.userName')"
        />
      </FormItem>

      <FormItem name="mobile" class="enter-x">
        <Input size="large" v-model:value="formData.mobile" :placeholder="t('sys.login.mobile')" />
      </FormItem>
      <FormItem name="sms" class="enter-x">
        <CountdownInput
          size="large"
          v-model:value="formData.sms"
          :placeholder="t('sys.login.smsCode')"
        />
      </FormItem>

      <FormItem class="enter-x">
        <Button type="primary" size="large" block @click="handleReset" :loading="loading">
          {{ t('common.resetText') }}
        </Button>
        <Button size="large" block class="mt-4" @click="handleBackLogin">
          {{ t('sys.login.backSignIn') }}
        </Button>
      </FormItem>
    </Form>
  </template>
</template>
<script lang="ts" setup>
  /**
   * 忘记密码表单组件
   */
  import { CountdownInput } from '@/components/CountDown';
  import { useI18n } from '@/hooks/web/useI18n';
  import { Button, Form, Input } from 'ant-design-vue';
  import { computed, reactive, ref, unref } from 'vue';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { LoginStateEnum, useFormRules, useLoginState } from './useLogin';

  /**
   * 表单项组件
   * @tutorial https://antdv.com/components/form-cn/#form-item
   * @tutorial https://antdv.com/docs/vue/getting-started-cn#%E6%B3%A8%E5%86%8C
   */
  const FormItem = Form.Item;
  const { t } = useI18n();
  const { handleBackLogin, getLoginState } = useLoginState();
  const { getFormRules } = useFormRules();

  /**
   * 表单组件实例
   */
  const formRef = ref();
  /**
   * 重置按钮载入状态
   */
  const loading = ref(false);
  /**
   * 表单数据
   */
  const formData = reactive({
    account: '',
    mobile: '',
    sms: '',
  });
  /**
   * 当前表单是否显示
   */
  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.RESET_PASSWORD);

  /**
   * 重置密码
   */
  async function handleReset() {
    /**
     * antd 表单组件实例
     */
    const form = unref(formRef);
    if (!form) return;
    /**
     * 表单重置
     * @tutorial https://antdv.com/components/form-cn/#%E6%96%B9%E6%B3%95
     */
    await form.resetFields();
  }
</script>
