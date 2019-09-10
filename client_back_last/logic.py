import time
from django.db.models import Q
from user.models import User
from user.views import generate_password
from vip.models import Vip
def filter_dict(request):
    search_dict=dict()
    client_id=request.GET.get('client_id')
    client_name=request.GET.get('client_name')
    phonenum = request.GET.get('phonenum')
    password=request.GET.get('password')
    if client_id:
        search_dict['id'] = client_id
    if client_name:
        search_dict['username']=client_name

    if phonenum:
        search_dict['phonenum'] = phonenum

    if password:
        search_dict['password']=password
    return search_dict


def create_dict(req, uid):
    search_dict=dict()
    client_name=req['create_client_name']
    phonenum = req['create_phonenum']
    password=generate_password(req['create_password'])
    vip_id=req['create_vip_id']

    if client_name:
        search_dict['username'] = client_name

    if phonenum:
        search_dict['phonenum'] = phonenum

    if password:
        search_dict['password'] = password
    if vip_id:
        search_dict['vip_id'] = vip_id
    search_dict['parent_id'] = uid
    search_dict['u_group_id'] = uid

    return search_dict

def update_dict(req):

    search_dict=dict()
    print("$$$$$$$$$$!!")
    req.setdefault('update_phonenum',0)
    req.setdefault('update_vip_id',0)
    req.setdefault('update_password',0)

    print(req)
    if req['update_phonenum'] != 0:
        search_dict['phonenum'] =req['update_phonenum']

    if req['update_password'] != 0:
        password = generate_password(req['update_password'])
        search_dict['password']=password
    if req['update_vip_id'] != 0 :
        search_dict['vip_id']=req['update_vip_id']
    return search_dict

def update_exist(lastlogin, kwarg):
    timeArray = time.localtime(int(lastlogin[0:10]))
    lastlogin = time.strftime("%Y-%m-%d", timeArray)
    lastlogin_list = lastlogin.split('-')

    print(lastlogin_list)
    print("----------------")
    us = User.objects.filter(**kwarg).filter(
        Q(last_login__year=lastlogin_list[0]) & Q(last_login__month=lastlogin_list[1]) & Q(last_login__day=lastlogin_list[2]))
    print(us)
    return us

def takeVipName(vip,kwargs):
    us=User.objects.filter(vip_id=vip.id).filter(**kwargs)
    return us

def user_list(us, request):
    # sorter排序自断
    sorter = request.GET.get('sorter')
    if sorter:
        sorter = sorter.split('_')
        # print(sorter)
        if sorter[1] == 'ascend':
            us = us.order_by(sorter[0])
        else:
            sorter = '-' + sorter[0]
            us = us.order_by(sorter)
    list1 = []
    for i in us:
        dict1 = {}
        dict1['client_id'] = i.id
        dict1['client_name'] = i.username

        if (i.vip_id== 1):
            vip_name="普通用户"
        elif i.vip_id==2:
            vip_name="普通管理用户"
        else:
            vip_name="超级管理用户"
        dict1['vip_name'] = vip_name

        dict1['last_login'] = i.last_login

        list1.append(dict1)
    return list1