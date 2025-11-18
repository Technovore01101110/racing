const questionCard = ({ q, a }) => {
	return `
    <dialog>
      <summary>
        ${q}
      </summary>
      ${a}
    </dialog>
  `;
};
