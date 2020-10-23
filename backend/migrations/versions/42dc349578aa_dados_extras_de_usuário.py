"""Dados extras de usuário

Revision ID: 42dc349578aa
Revises: 56ff99112e9e
Create Date: 2020-10-23 17:36:02.573553

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '42dc349578aa'
down_revision = '56ff99112e9e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('cidade', sa.String(length=64), nullable=True))
    op.add_column('user', sa.Column('data_nascimento', sa.DateTime(), nullable=True))
    op.add_column('user', sa.Column('estado', sa.String(length=64), nullable=True))
    op.add_column('user', sa.Column('nome', sa.String(length=128), nullable=True))
    op.add_column('user', sa.Column('profissao', sa.String(length=64), nullable=True))
    op.create_index(op.f('ix_user_cidade'), 'user', ['cidade'], unique=False)
    op.create_index(op.f('ix_user_estado'), 'user', ['estado'], unique=False)
    op.create_index(op.f('ix_user_profissao'), 'user', ['profissao'], unique=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_user_profissao'), table_name='user')
    op.drop_index(op.f('ix_user_estado'), table_name='user')
    op.drop_index(op.f('ix_user_cidade'), table_name='user')
    op.drop_column('user', 'profissao')
    op.drop_column('user', 'nome')
    op.drop_column('user', 'estado')
    op.drop_column('user', 'data_nascimento')
    op.drop_column('user', 'cidade')
    # ### end Alembic commands ###
