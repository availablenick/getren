"""empty message

Revision ID: 9735afa8ae60
Revises: 91126721b7a9
Create Date: 2020-11-06 18:39:52.971924

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9735afa8ae60'
down_revision = '91126721b7a9'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user') as batch_op:
        batch_op.add_column(sa.Column('confirmation', sa.Boolean(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user') as batch_op:
        batch_op.drop_column('confirmation')
    # ### end Alembic commands ###
