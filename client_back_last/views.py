from django.shortcuts import render
from django.core.cache import cache
from django.http import JsonResponse
import json

# Create your views here.
from common import keys
from client.logic import filter_dict,create_dict,update_dict,user_list, update_exist,takeVipName
from user.models import User
from vip.models import Vip

def get_user(request):
    # 当前显示页面
    currentPage = request.GET.get('currentPage')
    # 一页现实数量
    pageSize = request.GET.get('pageSize')
    client_id = request.GET.get('client_id')
    vip_id = request.GET.get('vip_id')
    phonenum = request.GET.get('phonenum')
    last_login = request.GET.get('last_login')
    uid = request.session.get('uid')
    if  not (client_id or phonenum or vip_id or last_login):
        # 分页显示所有设备信息
            us = User.objects.exclude(id=uid).order_by('id')
    else:
        # 按指定条件查询显示
        kwarg = filter_dict(request)
        if last_login :
            us = update_exist(last_login, kwarg).order_by('id')
        elif vip_id:
            # vip=Vip.objects.filter(vip_name=vip_name).first()
            # us=takeVipName(vip,kwarg).order_by('id')
            us=User.objects.filter(vip_id=vip_id).order_by('id')
        else:
            us = User.objects.filter(**kwarg).order_by('id')
    # 所有数据分页现实
    if not (currentPage and pageSize):
        currentPage = 1
        pageSize = 10
    else:
        currentPage=int(currentPage)
        pageSize=int(pageSize)

    list1 = user_list(us, request)
    res_data = {
        'list': list1,
        'pagination': {
            'total': len(list1),
            'pageSize':pageSize,
            'current': currentPage,
        }
    }
    return JsonResponse(res_data)

def create_user(request):
    req=json.loads(request.body)
    # vip_name = req['vip_name']
    uid = request.session.get('uid')
    kwargs=create_dict(req, uid)
    us = User.objects.create(**kwargs)
    # dict1 ={'普通用户':1,'普通管理用户':2,'超级管理用户':3}
    # us.vip_id =dict1[vip_name]
    us.save()
    data1=us.to_dict()


    return JsonResponse(data1)

def remove_user(request):
    req=json.loads(request.body)
    print(req['client_id'])
    for uid in req['client_id']:
        User.objects.filter(id=uid).delete()
    response_data = {
        'code': 0,
        'status': 'success'
    }
    return JsonResponse(response_data)

def update_user(request):
    req=json.loads(request.body)
    kwargs=update_dict(req)
    client_id=req['client_id']

    User.objects.filter(id=client_id).update(**kwargs)
    response_data = {
        'code': 0,
        'status': 'success'
    }
    return JsonResponse(response_data)
