module.exports = (pageName) =>`
const ${pageName.charAt(0).toUpperCase() + pageName.slice(1)} = () => {

  return (
    <div className="${pageName.charAt(0).toLowerCase() + pageName.slice(1)} flex justify-center items-center h-screen">
      ${pageName}
    </div>
  );
};

export default ${pageName.charAt(0).toUpperCase() + pageName.slice(1)};
`;
