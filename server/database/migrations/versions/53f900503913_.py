"""empty message

Revision ID: 53f900503913
Revises: 4dd7c56e419a
Create Date: 2021-05-28 01:41:34.336168

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '53f900503913'
down_revision = '4dd7c56e419a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('last_course_seen_token', sa.String(length=128), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('user', 'last_course_seen_token')
    # ### end Alembic commands ###