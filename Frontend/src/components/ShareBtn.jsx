

function ShareBtn() {
  const handleShare = async () => {
    try {
      await navigator.share({
        title: "My Recipe",
        text: "Check this recipe 🔥",
        url: window.location.href,
      });
    } catch (err) {
      console.log("Share cancelled / not supported");
    }
  };

  return (
    <button
      onClick={handleShare}
      className="bg-blue-500 text-white w-30 p-1 rounded"
    >
      Share 🔗
    </button>
  );
}

export default ShareBtn;
