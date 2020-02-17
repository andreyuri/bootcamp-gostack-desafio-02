import Mail from '../../lib/Mail';

class DeliverieMail {
  get key() {
    return 'DeliverieMail';
  }

  async handle({ data }) {
    const { deliveryman, recipient, product } = data;

    await Mail.sendEmail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Encomenda cadastrada',
      template: 'deliverie',
      context: {
        deliveryman: deliveryman.name,
        recipient: recipient.name,
        product,
      },
    });
  }
}

export default new DeliverieMail();
