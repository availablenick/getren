from .. import db

class Text(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.Text, nullable=False)
    section = db.Column(db.String(16), index = True)

    @classmethod
    def get_from_section(cls, section):
        text = db.session.query(Text).filter(Text.section == section).first()
        if text:
            return text
        return None

    @classmethod
    def add(cls, section, body):
        try:
            text = cls(section=section, body=body)
            db.session.add(text)
            db.session.commit()
            return text
        except Exception as e:
            db.session.rollback()
            return None

    @classmethod
    def update_body(cls, section, new_body):
        try:
            text = db.session.query(Text).filter(Text.section == section)
            text.update({Text.body: new_body})
            db.session.commit()
            return text.first()
        except Exception as e:
            db.session.rollback()
            return None
