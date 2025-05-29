const findData = async (model: any, query: string, data: string) => {
  const result = await model.findAll({
    where: {
      [query]: data,
    },
  });
  return result;
};

export default findData;
