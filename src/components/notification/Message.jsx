export const showMessage = (type, content, messageApi) => {
  messageApi.open({
    type: type,
    content: content,
  });
};
