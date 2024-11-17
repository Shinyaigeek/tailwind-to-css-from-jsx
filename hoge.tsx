export const Card = ({
  title,
  description,
  buttonLabel
}: {
  title: string;
  description: string;
  buttonLabel: string;
}) => {
  return <div className={styles.TODO-dy0OrN4w0m}>
      <h1 className={styles.TODO-OdkjoPN5fQ}>{title}</h1>
      <p className={styles.TODO-JysSX85FzN}>{description}</p>
      <button className={styles.TODO-FSAXyeYawd}>
        {buttonLabel}
      </button>
    </div>;
};